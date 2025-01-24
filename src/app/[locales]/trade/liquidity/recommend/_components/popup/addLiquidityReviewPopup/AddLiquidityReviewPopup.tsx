import PopupTemplate from '@/src/components/PopupTemplate';
import ApproveMax from './ApproveMax';
import PositionInfo from './PositionInfo';
import { PositionType } from '../../../_mock/liquidityAmount';
import TotalAdd from './TotalAdd';
import Button from '@/src/components/Button';
import { useAccount, useSendTransaction } from 'wagmi';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { fetchGetAllowance } from '@/src/lib/utils/api/liquidity/fetchGetAllowance';
import { fetchGetAddRecommendLiquidityInfo } from '@/src/lib/utils/api/liquidity/fetchGetAddRecommendLiquidityInfo';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { defaultChain, KRWO, USDT } from '@/src/lib/constants/token';
import ButtonLoading from '@/src/components/ButtonLoading';
import { useEffect, useState } from 'react';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import AddLiquidityPendingPopup from '../../../../_components/addLiquidity/AddLiquidtyPendingPopup';
import { applyDecimals, calcTotalLiquidity } from '@/src/lib/utils/calcTick';
import { fetchSendLog } from '@/src/lib/utils/api/fetchSendLog';
import StakePopup from '../../../../_components/addLiquidity/StakePopup';
import TransactionFailPopup from '@/src/components/popups/TransactionFailPopup';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { useRouter } from '@/src/i18n/routing';
import { waitForTransactionReceipt } from '@wagmi/core';
import { wagmiConfig } from '@/src/lib/utils/wagmi';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import TransactionSuccessPopup from '../../../../_components/TransactionSuccessPopup';

interface AddLiquidityInputPopupProps extends PositionType {
  open: boolean;
  onClose: () => void;
  mode: 'auto' | 'normal';
  tokenAmount: {
    KRWO: string;
    USDT: string;
  };
}

export default function AddLiquidityReviewPopup({
  open,
  onClose,
  mode,
  tokenAmount,
  ...position
}: AddLiquidityInputPopupProps) {
  const router = useRouter();
  const { address, chainId } = useAccount();
  const queryClient = useQueryClient();
  const { sendTransactionAsync, isPending } = useSendTransaction();
  const { openPopup, closePopup } = usePopupStore((state) => state);

  const [
    { data: reviewInfo },
    { data: usdtAllowance, isPending: isAllowancePending },
    { data: krwoAllowance, isPending: isKrwoAllowancePending },
  ] = useQueries({
    queries: [
      {
        queryKey: ['reviewInfo', position],
        queryFn: () =>
          fetchGetAddRecommendLiquidityInfo({
            amount0: safeCalc
              .multiply(
                tokenAmount.USDT,
                10 **
                  USDT.decimal[
                    checkIsAvailableChain(chainId) ? chainId : defaultChain.id
                  ],
              )
              .toString(),
            amount1: safeCalc
              .multiply(tokenAmount.KRWO, 10 ** KRWO.decimal)
              .toString(),
            autoSwap: mode === 'auto' ? true : false,
            chainId: chainId!,
            lowerTick: position.lowerTick,
            upperTick: position.upperTick,
          }),
      },
      {
        queryKey: ['allowance', 'usdt', address],
        queryFn: () =>
          fetchGetAllowance({
            chainId: chainId!,
            token: 'usdt',
            walletAddress: address!,
          }),
        enabled: !!address,
      },
      {
        queryKey: ['allowance', 'krwo', address],
        queryFn: () =>
          fetchGetAllowance({
            chainId: chainId!,
            token: 'krwo',
            walletAddress: address!,
          }),
        enabled: !!address,
      },
    ],
  });

  const [isApproved, setIsApproved] = useState<{
    krwo: boolean;
    usdt: boolean;
  }>({
    krwo: true,
    usdt: true,
  });

  const totalAmount = calcTotalLiquidity({
    currentPrice: position.currentPrice,
    usdtAmount: reviewInfo?.amount0 || '0',
    krwAmount: reviewInfo?.amount1 || '0',
    usdtDecimal:
      USDT.decimal[checkIsAvailableChain(chainId) ? chainId : defaultChain.id],
  });

  const handleAddLiquidity = async () => {
    openPopup(AddLiquidityPendingPopup, {
      tokens: [
        {
          ...KRWO,
          amount: applyDecimals(reviewInfo?.amount1 || '0', KRWO.decimal),
        },
        {
          ...USDT,
          amount: applyDecimals(
            reviewInfo?.amount0 || '0',
            USDT.decimal[
              checkIsAvailableChain(chainId) ? chainId : defaultChain.id
            ],
          ),
        },
      ],
      totalLiquidity: totalAmount,
      type: 'add',
    });
    try {
      const tx = await sendTransactionAsync({
        to: reviewInfo?.contractAddress,
        data: reviewInfo?.data,
      });

      const { status } = await waitForTransactionReceipt(wagmiConfig, {
        chainId: chainId as ChainIdType,
        hash: tx,
      });

      queryClient.invalidateQueries({ queryKey: ['getBalance'] });

      if (status === 'success') {
        closePopup(AddLiquidityPendingPopup);
        if (chainId === 8217) {
          openPopup(StakePopup, {
            tokens: [
              {
                ...KRWO,
                amount: applyDecimals(reviewInfo?.amount1 || '0', KRWO.decimal),
              },
              {
                ...USDT,
                amount: applyDecimals(
                  reviewInfo?.amount0 || '0',
                  USDT.decimal[
                    checkIsAvailableChain(chainId) ? chainId : defaultChain.id
                  ],
                ),
              },
            ],
            totalLiquidity: totalAmount,
            txHash: tx,
            closeCallback: () => router.push('/trade/liquidity/my-position'),
          });
        } else {
          openPopup(TransactionSuccessPopup, {
            title: 'Add success!',
            type: 'increase',
            totalLiquidity: totalAmount,
            txHash: tx,
            tokens: [
              {
                ...KRWO,
                amount: applyDecimals(reviewInfo?.amount1 || '0', KRWO.decimal),
              },
              {
                ...USDT,
                amount: applyDecimals(
                  reviewInfo?.amount0 || '0',
                  USDT.decimal[
                    checkIsAvailableChain(chainId) ? chainId : defaultChain.id
                  ],
                ),
              },
            ],
          });
        }
      } else throw new Error('Add Liquidity failed');
    } catch (error) {
      console.error(error);
      closePopup(AddLiquidityPendingPopup);
      openPopup(TransactionFailPopup);
      fetchSendLog({ name: 'addLiquidity', error });
    }
  };

  useEffect(() => {
    if (isAllowancePending || isKrwoAllowancePending) return;
    setIsApproved({
      krwo: safeCalc.isGreaterOrEqual(
        krwoAllowance?.allowance || '0',
        tokenAmount.KRWO,
      ),
      usdt: safeCalc.isGreaterOrEqual(
        usdtAllowance?.allowance || '0',
        tokenAmount.USDT,
      ),
    });
  }, [krwoAllowance, usdtAllowance]);

  return (
    <PopupTemplate open={open} onClose={onClose} showCloseButton>
      <h3 className="font-bold -mt-7 ml-6">Review</h3>
      <section className="px-6 py-3">
        <div className="overflow-y-scroll scrollbar-hide max-lg:max-h-[calc(95dvh-94px)] w-full">
          {!isAllowancePending || !isKrwoAllowancePending ? (
            <ApproveMax
              spenderAddress={usdtAllowance?.spenderAddress}
              isPending={isAllowancePending || isKrwoAllowancePending}
              isApproved={isApproved}
              setIsApproved={setIsApproved}
            />
          ) : (
            <ButtonLoading />
          )}
          <PositionInfo {...position} />
          <p className="p1 pt-4 pb-3">You Add</p>
          <TotalAdd
            mode={mode}
            USDTAmount={reviewInfo?.amount0 || '0'}
            KRWOAmount={reviewInfo?.amount1 || '0'}
            totalAmount={formatNumber(totalAmount, 0)}
            userInputTokenAmount={tokenAmount}
            title="Total Liquidity"
          />
        </div>
        <Button
          size="xl"
          color="primary"
          className="mt-5 mb-2 flex flex-row justify-center items-center min-h-[54px]"
          onClick={handleAddLiquidity}
          disabled={!isApproved.krwo || !isApproved.usdt}
        >
          {isPending ? <ButtonLoading /> : 'Add'}
        </Button>
      </section>
    </PopupTemplate>
  );
}
