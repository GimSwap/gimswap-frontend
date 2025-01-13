import PopupTemplate from '@/src/components/PopupTemplate';
import { TokenType } from '@/src/lib/types/TokenType';
import { insertComma } from '@/src/lib/utils/insertComma';
import ArrowDownIcon from '@/public/svg/arrow/arrow-narrow-down.svg';
import Button from '@/src/components/Button';
import { MyPositionType } from '@/src/lib/types/api/liquidity/GetPositionType';
import { applyDecimals, calcTotalLiquidity } from '@/src/lib/utils/calcTick';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { KRWO } from '@/src/lib/constants/token';
import { USDT } from '@/src/lib/constants/token';
import TotalAdd from '../../../../recommend/_components/popup/addLiquidityReviewPopup/TotalAdd';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import AddLiquidityPendingPopup from '../../../../_components/addLiquidity/AddLiquidtyPendingPopup';
import { useAccount, useSendTransaction } from 'wagmi';
import TransactionFailPopup from '@/src/components/popups/TransactionFailPopup';
import { fetchSendLog } from '@/src/lib/utils/api/fetchSendLog';
import { fetchGetIncreaseLiquidityInfo } from '@/src/lib/utils/api/liquidity/fetchGetIncreaseLiquidityInfo';
import TransactionSuccessPopup from '../../../../_components/TransactionSuccessPopup';
import { waitForTransactionReceipt } from '@wagmi/core';
import { wagmiConfig } from '@/src/lib/utils/wagmi';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { fetchGetAllowance } from '@/src/lib/utils/api/liquidity/fetchGetAllowance';
import ApproveMax from '../../../../recommend/_components/popup/addLiquidityReviewPopup/ApproveMax';
import { useEffect, useState } from 'react';

interface MyPositionAddLiquidityReviewPopupProps {
  open: boolean;
  onClose: () => void;
  mode: 'normal' | 'auto';
  tokens: ({
    amount: string;
  } & Pick<TokenType, 'symbol' | 'color' | 'icon'>)[];
  selectedMyPosition: MyPositionType;
  totalAmount: string;
  currentPrice: number;
}

export default function MyPositionAddLiquidityReviewPopup({
  open,
  onClose,
  mode,
  tokens,
  selectedMyPosition,
  totalAmount,
  currentPrice,
}: MyPositionAddLiquidityReviewPopupProps) {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { sendTransactionAsync } = useSendTransaction();
  const { openPopup, closePopup } = usePopupStore((state) => state);
  const { refetchPositions } = useLiquidityStore((state) => state);

  const [isApproved, setIsApproved] = useState<{
    krwo: boolean;
    usdt: boolean;
  }>({
    krwo: true,
    usdt: true,
  });

  const [
    { data: reviewInfo, isPending: isReviewInfoPending },
    { data: usdtAllowance, isPending: isUsdtAllowancePending },
    { data: krwoAllowance, isPending: isKrwoAllowancePending },
  ] = useQueries({
    queries: [
      {
        queryKey: ['myPositionDetail', address],
        queryFn: () =>
          fetchGetIncreaseLiquidityInfo({
            amount0: safeCalc
              .multiply(tokens[1].amount, 10 ** KRWO.decimal)
              .toString(),
            amount1: safeCalc
              .multiply(tokens[0].amount, 10 ** USDT.decimal)
              .toString(),
            autoSwap: mode === 'auto' ? true : false,
            chainId: 8217,
            tokenId: selectedMyPosition.tokenId,
          }),
      },
      {
        queryKey: ['allowance', 'usdt', address],
        queryFn: () =>
          fetchGetAllowance({
            chainId: 8217,
            token: 'usdt',
            walletAddress: address!,
          }),
        enabled: !!address,
      },
      {
        queryKey: ['allowance', 'krwo', address],
        queryFn: () =>
          fetchGetAllowance({
            chainId: 8217,
            token: 'krwo',
            walletAddress: address!,
          }),
        enabled: !!address,
      },
    ],
  });

  const addLiquidity = calcTotalLiquidity({
    currentPrice,
    usdtAmount: reviewInfo?.amount0 || '0',
    krwAmount: reviewInfo?.amount1 || '0',
  });

  const handleIncreaseLiquidity = async () => {
    openPopup(AddLiquidityPendingPopup, {
      tokens: [
        { ...KRWO, amount: applyDecimals(reviewInfo?.amount1 || '0') },
        { ...USDT, amount: applyDecimals(reviewInfo?.amount0 || '0') },
      ],
      totalLiquidity: addLiquidity,
      totalLiquidityWithOriginal: safeCalc
        .add(totalAmount, addLiquidity)
        .toString(),
      type: 'increase',
    });
    try {
      const tx = await sendTransactionAsync({
        to: reviewInfo?.contractAddress,
        data: reviewInfo?.data,
      });

      const { status } = await waitForTransactionReceipt(wagmiConfig, {
        chainId: 8217,
        hash: tx,
      });

      if (status === 'success') {
        closePopup(AddLiquidityPendingPopup);
        openPopup(TransactionSuccessPopup, {
          title: 'Add success!',
          tokens: [
            { ...KRWO, amount: applyDecimals(reviewInfo?.amount1 || '0') },
            { ...USDT, amount: applyDecimals(reviewInfo?.amount0 || '0') },
          ],
          totalLiquidity: addLiquidity,
          type: 'increase',
          resultLiquidity: safeCalc.add(totalAmount, addLiquidity).toString(),
          txHash: tx,
        });
        queryClient.invalidateQueries({ queryKey: ['getBalance'] });
        refetchPositions();
      } else throw new Error('Add Liquidity failed');
    } catch (error) {
      console.error(error);
      closePopup(AddLiquidityPendingPopup);
      openPopup(TransactionFailPopup);
      fetchSendLog({ name: 'addLiquidity', error });
    }
  };

  useEffect(() => {
    if (isUsdtAllowancePending || isKrwoAllowancePending) return;
    setIsApproved({
      krwo: safeCalc.isGreaterOrEqual(
        krwoAllowance?.allowance || '0',
        reviewInfo?.amount1 || '0',
      ),
      usdt: safeCalc.isGreaterOrEqual(
        usdtAllowance?.allowance || '0',
        reviewInfo?.amount0 || '0',
      ),
    });
  }, [krwoAllowance, usdtAllowance]);

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      closeButtonStyle="top-9"
    >
      <h3 className="font-bold -mt-4 ml-6">Review</h3>
      <section className="px-6 py-3 flex flex-col gap-3 items-center w-full">
        <div className="overflow-y-scroll scrollbar-hide max-lg:max-h-[calc(95dvh-94px)] w-full flex flex-col items-center">
          {(!isUsdtAllowancePending || !isKrwoAllowancePending) && (
            <ApproveMax
              spenderAddress={usdtAllowance?.spenderAddress}
              isPending={isUsdtAllowancePending || isKrwoAllowancePending}
              isApproved={isApproved}
              setIsApproved={setIsApproved}
            />
          )}
          <div className="w-full flex flex-col gap-3 items-center">
            {isApproved.krwo && isApproved.usdt && (
              <p className="p1 w-full">You Add</p>
            )}
            <TotalAdd
              mode={mode}
              KRWOAmount={reviewInfo?.amount1 || '0'}
              USDTAmount={reviewInfo?.amount0 || '0'}
              totalAmount={addLiquidity}
              userInputTokenAmount={{
                KRWO: formatNumber(tokens[0].amount, 2),
                USDT: formatNumber(tokens[1].amount, 2),
              }}
              title="Add Liquidity"
            />
            <ArrowDownIcon />
            <section className="px-4 py-3 rounded-lg bg-purple-50 w-full flex flex-row justify-between">
              <p className="text-purple-500 p1">Total Liquidity</p>
              <p className="text-purple-500 p1 font-bold">
                {`₩ ${insertComma(
                  formatNumber(
                    safeCalc.add(totalAmount, addLiquidity).toString(),
                    0,
                  ),
                )}`}
              </p>
            </section>
          </div>
        </div>
        <Button
          className="mt-5 mb-3"
          color="primary"
          size="xl"
          onClick={handleIncreaseLiquidity}
          disabled={isReviewInfoPending || !isApproved.krwo || !isApproved.usdt}
        >
          Add
        </Button>
      </section>
    </PopupTemplate>
  );
}
