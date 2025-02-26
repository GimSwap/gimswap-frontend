import { useAccount } from 'wagmi';
import Button from '@/src/components/Button';
import Chip from '@/src/components/Chip';
import { PaginationPushType } from '@/src/components/popups/PopupPagination';
import SwapAndSend from './SwapAndSend';
import { makeSignMessage } from '../../../trade/buy/_utils/makeSignMessage';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { PaymentMessageDataType } from '@/src/lib/types/PaymetMessageType';
import { OPEN_VOUCHER } from '@/src/lib/constants/token';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import throttle from '@/src/lib/utils/throttle';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import TransferSignPopup from './TransferSignPopup';
import TransferSignSuccessPopup from './TransferSignSuccessPopup';
import { checkIsMobileDevice } from '@/src/lib/utils/checkIsMobileDevice';
import useSign from '@/src/lib/hook/useSign';
import { useGetCurrentWallet } from '@/src/lib/hook/useGetCurrentWallet';
import TransferMoveToOpenvoucherPopup from './TransferMoveToOpenvoucherPopup';

interface TransferButtonsProps {
  next: PaginationPushType;
  amount: number;
  OVBalance: string | undefined;
  usdtPrice: string;
}

export default function TransferButtons({
  next,
  amount,
  OVBalance,
  usdtPrice,
}: TransferButtonsProps) {
  const t = useTranslations('quickDeposit.buyOv');

  const { sign } = useSign();
  const { data: currentWallet } = useGetCurrentWallet();
  const { isConnected, address, chainId, connector } = useAccount();
  const { openPopup, closePopup } = usePopupStore((state) => state);

  const messageHandler = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== process.env.NEXT_PUBLIC_OPEN_VOUCHER_URL) return;
      const message = JSON.parse(event.data) as PaymentMessageDataType;
      if (message.state === 'CLOSE') {
        closePopup(TransferMoveToOpenvoucherPopup);
        closePopup(TransferSignSuccessPopup);
      }
      if (message.state === 'PAYMENT_SUCCESS') {
        closePopup(TransferSignSuccessPopup);
        next(SwapAndSend, {
          OVAmount: (amount / 10000).toString(),
          usdtPrice,
        });
      }
    },
    [closePopup, next, amount, usdtPrice],
  );

  const handleOpenOpenVoucher = (signature: string, signMessage: string) => {
    if (!address || !chainId || !connector || !currentWallet) return;

    const searchParams = new URLSearchParams({
      amount: (amount / 10000).toString(),
      method: 'purchase',
      walletAddress: address,
      redirectOnCancel: window.location.href,
      redirectOnError: window.location.href,
      signature,
      signMessage: btoa(signMessage),
      chainId: chainId.toString(),
      walletId: currentWallet.connectorId[0],
    });

    openPopup(TransferMoveToOpenvoucherPopup);

    const popup = window.open(
      `${process.env.NEXT_PUBLIC_OPEN_VOUCHER_URL}/payment/buy?${searchParams.toString()}`,
      '_blank',
      'popup=true,width=380,height=780',
    );
    if (!popup) alert(t('disabledPopupBlocker'));
  };

  const handleBuyOvButton = throttle(async () => {
    try {
      if (!address || !chainId || !connector || !currentWallet) return;
      const signMessage = makeSignMessage(address);

      if (!signMessage) return;

      openPopup(TransferSignPopup);
      const signature = await sign(address, signMessage, currentWallet);
      closePopup(TransferSignPopup);
      if (!signature) return;

      openPopup(TransferSignSuccessPopup, {
        handleOpenOpenVoucher: () =>
          handleOpenOpenVoucher(signature, signMessage),
      });

      if (
        checkIsMobileDevice() &&
        currentWallet &&
        !currentWallet.supportInAppBrowser
      )
        return;

      handleOpenOpenVoucher(signature, signMessage);
    } catch (err) {
      console.log(err);
    }
  }, 1500);

  useEffect(() => {
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [messageHandler]);

  return (
    <section className="flex flex-row gap-2 px-6 pb-5 absolute bottom-0 w-full bg-black-1">
      {OVBalance && +OVBalance > 0 && (
        <div className="w-full relative">
          <Button
            color="secondary"
            size="xl"
            onClick={() =>
              next(SwapAndSend, {
                OVAmount: applyDecimals(OVBalance, OPEN_VOUCHER.decimal),
                usdtPrice,
              })
            }
          >
            {t('skipButton')}
          </Button>
          <Chip
            color="black"
            className="w-fit absolute top-0 right-1/2 whitespace-nowrap translate-x-1/2 -translate-y-1/2"
          >
            {t('alreadyBought')}
          </Chip>
        </div>
      )}
      <Button
        color="primary"
        size="xl"
        className="whitespace-nowrap"
        disabled={amount / 10000 <= 0 || !isConnected || !currentWallet}
        onClick={handleBuyOvButton}
      >
        {t('buyOvButton')}
      </Button>
    </section>
  );
}
