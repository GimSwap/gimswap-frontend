'use client';

import Button from '@/src/components/Button';
import { useTranslations } from 'next-intl';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { fetchTransfer } from '@/src/lib/utils/api/swift/fetchTransfer';
import { GetQuoteResponseType } from '@/src/lib/types/api/swift/GetQuoteType';
import { TransferRequestType } from '@/src/lib/types/api/swift/TransferType';
import { bsc } from 'viem/chains';
import {
  CONTRACT_ADDRESS_MAP,
  OPEN_VOUCHER,
  USDT,
} from '@/src/lib/constants/token';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import TransferPendingPopup from './TransferPendingPopup';
import { signTypedData } from '../_utils/signTyedData';
import { randomBytes } from 'crypto';
import { useEffect, useState } from 'react';
import { fetchGetTransferReceipt } from '@/src/lib/utils/api/fetchGetReceipt';
import TransferSuccessPopup from './TransferSuccessPopup';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import TransferRetryPopup from './TransferRetryPopup';
import { FetchError } from '@/src/lib/utils/api/fetchClient';
import { RETRY_TRANSFER } from '@/src/lib/constants/ErrorCode';

interface SwapAndSendButtonsProps {
  OVAmount: string;
  usdtAmount: string;
  prev: () => void;
  quote: GetQuoteResponseType | undefined;
  refetchQuote: () => void;
}

export default function SwapAndSendButtons({
  OVAmount,
  usdtAmount,
  prev,
  quote,
  refetchQuote,
}: SwapAndSendButtonsProps) {
  const t = useTranslations('quickDeposit.swapAndSend');
  const { address } = useAccount();
  const { openPopup, closePopup } = usePopupStore((state) => state);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { mutateAsync: transfer } = useMutation({
    mutationFn: (params: TransferRequestType) => fetchTransfer(params),
  });

  const { data: receipt } = useQuery({
    queryKey: ['transferReceipt', txHash],
    queryFn: () =>
      fetchGetTransferReceipt({ chainId: bsc.id, txHash: txHash! }),
    enabled: !!txHash,
    refetchInterval: 1000,
  });

  const decimalAppliedOvAmount = safeCalc
    .multiply(OVAmount, 10 ** OPEN_VOUCHER.decimal)
    .toString();

  const handleSwapAndSend = async () => {
    if (!quote || !address) return;
    const validAfter = Math.floor(Date.now() / 1000) - 60;
    const validBefore = Math.floor(Date.now() / 1000) + 600;
    const nonce = randomBytes(32).toString('hex');

    try {
      openPopup(TransferPendingPopup, {
        amount: usdtAmount,
      });

      const signature = await signTypedData({
        address,
        decimalAppliedOvAmount,
        validAfter,
        validBefore,
        nonce: `0x${nonce}`,
      });

      if (!signature) return;

      const { txHash } = await transfer({
        chainId: bsc.id,
        amountIn: decimalAppliedOvAmount,
        amountOut: quote.amountOut,
        tokenOut: USDT.contractAddress[bsc.id],
        recipient: address as `0x${string}`,
        signature,
        nonce,
        validAfter,
        validBefore,
      });

      setTxHash(txHash);
    } catch (err) {
      if (err instanceof FetchError) {
        if (err.response.code === RETRY_TRANSFER) {
          closePopup(TransferPendingPopup);
          openPopup(TransferRetryPopup, {
            amount: OVAmount,
          });
          refetchQuote();
        }
      }
    }
  };

  useEffect(() => {
    switch (receipt?.status) {
      case 'SUCCESS':
        setTxHash(null);
        const confirmedUSDTAmount = receipt.logs.find(
          (log) =>
            log.address === CONTRACT_ADDRESS_MAP.GIMSWAP_SWIFT_TRANSFER[bsc.id],
        )?.data;

        const decimalizationUSDTAmount = confirmedUSDTAmount
          ? applyDecimals(+confirmedUSDTAmount.slice(2), USDT.decimal[bsc.id])
          : usdtAmount;

        closePopup(TransferPendingPopup);
        openPopup(TransferSuccessPopup, {
          amount: decimalizationUSDTAmount,
        });
        break;
      case 'FAILED':
        setTxHash(null);
        closePopup(TransferRetryPopup);
        break;
    }
  }, [receipt]);

  return (
    <section className="flex flex-row gap-2 px-6 pb-5 absolute bottom-0 w-full bg-black-1">
      <Button
        color="secondary"
        size="xl"
        onClick={prev}
        className="max-w-[111px]"
      >
        {t('previousButton')}
      </Button>
      <Button
        color="primary"
        size="xl"
        onClick={handleSwapAndSend}
        className="whitespace-nowrap w-full"
      >
        {t('swapAndSendButton')}
      </Button>
    </section>
  );
}
