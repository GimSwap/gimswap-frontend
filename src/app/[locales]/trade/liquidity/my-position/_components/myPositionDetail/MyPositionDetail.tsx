import { PaginationPushType } from '@/src/components/popups/PopupPagination';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import PositionInfo from './PositionInfo';
import BarChartAndInfo from './BarChartAndInfo';
import Harvest from './harvest/Harvest';
import {
  KLAYTN,
  KRWO,
  POSITION_TOKEN_DECIMAL,
  USDT,
} from '@/src/lib/constants/token';
import Button from '@/src/components/Button';
import Link from 'next/link';
import ChevronRightIcon from '@/public/svg/chevron/right.svg';
import MyPositionAddLiquidityPopup from './addLiquidity/MyPositionAddLiquidityPopup';
import { useEffect } from 'react';
import RemovePosition from './removePosition/RemovePosition';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import {
  applyDecimals,
  calcTotalLiquidity,
  usdtTickToKrw,
} from '@/src/lib/utils/calcTick';
import { fetchGetMyPositionDetail } from '@/src/lib/utils/api/liquidity/fetchGetPositionDetail';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import StakePopup from '../../../_components/addLiquidity/StakePopup';
import { useQuery } from '@tanstack/react-query';

interface MyPositionDetailProps {
  next: PaginationPushType;
  reset: () => void;
}

export default function MyPositionDetail({
  next,
  reset,
}: MyPositionDetailProps) {
  const { selectedMyPosition, currentPrice } = useLiquidityStore(
    (state) => state,
  );
  const { openPopup } = usePopupStore((state) => state);
  const {
    data: positionDetail,
    isPending: positionDetailLoading,
    refetch,
  } = useQuery({
    queryKey: ['positionDetail', selectedMyPosition?.tokenId!],
    queryFn: () =>
      fetchGetMyPositionDetail({
        chainId: 8217,
        tokenId: selectedMyPosition?.tokenId!,
      }),
  });

  const totalAmount = calcTotalLiquidity({
    currentPrice,
    usdtAmount: positionDetail?.liquidity.token0.value || '0',
    krwAmount: positionDetail?.liquidity.token1.value || '0',
  });

  const usdtAmount = safeCalc
    .multiply(
      safeCalc
        .divide(
          positionDetail?.liquidity.token0.value || '0',
          10 ** POSITION_TOKEN_DECIMAL,
        )
        .toFixed(),
      currentPrice,
    )
    .toFixed();

  const krwoAmount = safeCalc
    .divide(
      positionDetail?.liquidity.token1.value || '0',
      10 ** POSITION_TOKEN_DECIMAL,
    )
    .toFixed();

  const kaiaFee = safeCalc
    .divide(
      safeCalc
        .multiply(
          usdtTickToKrw(positionDetail?.harvest.tickKrwo || 0),
          positionDetail?.harvest.value || '0',
        )
        .toFixed(),
      10 ** POSITION_TOKEN_DECIMAL,
    )
    .toFixed();

  const krwoFee = applyDecimals(
    positionDetail?.fee.token1.value || '0',
    KRWO.decimal,
    10,
  );
  const usdtFee = safeCalc
    .multiply(
      applyDecimals(positionDetail?.fee.token0.value || '0', USDT.decimal, 10),
      currentPrice,
    )
    .floor()
    .toString();

  useEffect(() => {
    if (selectedMyPosition) {
      reset();
      refetch();
    }
  }, [selectedMyPosition]);

  useEffect(() => {
    if (!selectedMyPosition?.farming && !positionDetailLoading)
      openPopup(StakePopup, {
        tokens: [
          {
            ...KRWO,
            amount: applyDecimals(
              positionDetail?.liquidity.token1.value || '0',
            ),
          },
          {
            ...USDT,
            amount: applyDecimals(
              positionDetail?.liquidity.token0.value || '0',
            ),
          },
        ],
        totalLiquidity: totalAmount,
        tokenId: selectedMyPosition?.tokenId!,
      });
  }, [selectedMyPosition?.farming, positionDetailLoading]);
  return (
    <section className="max-lg:h-[95dvh] relative overflow-y-scroll scrollbar-hide">
      <h3 className="h3 font-bold w-fit">Liquidity</h3>
      <section className="mt-4 relative overflow-y-scroll scrollbar-hide max-lg:max-h-[calc(95dvh-94px)] pb-[94px]">
        <section className="flex flex-col gap-4">
          <PositionInfo
            isActive={!!selectedMyPosition?.active}
            isFarming={!!selectedMyPosition?.farming}
            apr={selectedMyPosition?.apr!}
            minTick={Math.floor(
              +usdtTickToKrw(selectedMyPosition?.liquidity.lowerTick || 0),
            )}
            maxTick={Math.floor(
              +usdtTickToKrw(selectedMyPosition?.liquidity.upperTick || 0),
            )}
            currentPrice={currentPrice}
          />
          <BarChartAndInfo
            title="Liquidity"
            totalAmount={totalAmount}
            tokens={[
              {
                ...KRWO,
                value: positionDetail?.liquidity.token1.value || '0',
                amount: krwoAmount,
              },
              {
                ...USDT,
                value: positionDetail?.liquidity.token0.value || '0',
                amount: usdtAmount,
              },
            ]}
          />
          <Harvest
            tokenId={selectedMyPosition?.tokenId!}
            usdt={{
              value: positionDetail?.fee.token0.value || '0',
              amount: usdtFee,
            }}
            krwo={{
              value: positionDetail?.fee.token1.value || '0',
              amount: krwoFee,
            }}
            kaia={{
              value: positionDetail?.harvest.value || '0',
              amount: kaiaFee,
            }}
          />
          <Link
            className="flex flex-row items-center justify-center gap-1"
            href={'https://dgswap.io/liquidity/' + selectedMyPosition?.tokenId}
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="font-bold text-purple-500 p1">
              View History in DragonSwap
            </p>
            <ChevronRightIcon className="w-5 h-5 stroke-purple-500" />
          </Link>
        </section>
      </section>
      <section className="flex flex-row gap-2 absolute bottom-0 py-5 w-full bg-black-1">
        <Button
          className="z-10"
          color="secondary"
          size="xl"
          onClick={() =>
            next(RemovePosition, {
              fees: [
                {
                  ...KRWO,
                  amount: krwoFee,
                  value: positionDetail?.fee.token1.value || '0',
                },
                {
                  ...USDT,
                  amount: usdtFee,
                  value: positionDetail?.fee.token0.value || '0',
                },
                {
                  ...KLAYTN,
                  amount: kaiaFee,
                  value: positionDetail?.harvest.value || '0',
                },
              ],
              tokens: [
                {
                  ...KRWO,
                  amount: positionDetail?.liquidity.token1.value || '0',
                },
                {
                  ...USDT,
                  amount: positionDetail?.liquidity.token0.value || '0',
                },
              ],
              totalAmount,
              selectedMyPosition: selectedMyPosition!,
              totalLiquidity: positionDetail?.totalLiquidity || '0',
            })
          }
        >
          Remove
        </Button>
        <Button
          className="z-10"
          color="primary"
          size="xl"
          onClick={() =>
            next(MyPositionAddLiquidityPopup, {
              selectedMyPosition: selectedMyPosition!,
              totalAmount,
              currentPrice,
            })
          }
        >
          Add
        </Button>
      </section>
    </section>
  );
}
