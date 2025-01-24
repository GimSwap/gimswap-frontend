'use client';

import { GetRecommendPositionResponseType } from '@/src/lib/types/api/liquidity/GetRecommendPositionType';
import Position from './Position';
import PositionButton from './PositionButton';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import { usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { useAccount } from 'wagmi';
import { useQueries } from '@tanstack/react-query';
import { fetchGetRecommendPositions } from '@/src/lib/utils/api/liquidity/fetchGetRecommendPositions';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { fetchGetCurrentTick } from '@/src/lib/utils/api/liquidity/fetchGetCurrentTick';
import { GetCurrentTickResponseType } from '@/src/lib/types/api/liquidity/GetCurrentTickType';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { DEX_ICON_MAP } from '@/src/lib/constants/dex';
import { defaultChain } from '@/src/lib/constants/token';

export default function RecommendPositions() {
  const { selectedPosition, setSelectedPosition, setCurrentPrice } =
    useLiquidityStore((state) => state);
  const { chainId } = useAccount();

  const [
    { data: positions, isLoading: isLoadingPositions },
    { data: currentTick, isLoading: isLoadingCurrentTick },
  ] = useQueries({
    queries: [
      {
        queryKey: ['recommendPositions', chainId],
        queryFn: () =>
          fetchGetRecommendPositions(
            checkIsAvailableChain(chainId) ? chainId : defaultChain.id,
          ),
        select: (data: GetRecommendPositionResponseType) => data?.liquidity,
      },
      {
        queryKey: ['usdtCurrentTick', chainId],
        queryFn: () =>
          fetchGetCurrentTick({
            chainId: checkIsAvailableChain(chainId) ? chainId : defaultChain.id,
            token: 'usdt',
          }),
        select: (data: GetCurrentTickResponseType) => data?.currentTick,
      },
    ],
  });

  if (isLoadingPositions || isLoadingCurrentTick)
    return (
      <section className="w-full h-[500px] grid place-items-center">
        <LoadingSpinner />
      </section>
    );

  return (
    <>
      <section className="flex flex-col gap-2 mt-4">
        {positions?.map(({ apr, lowerTick, upperTick, label }) => {
          const isSelected = selectedPosition?.label === label;
          return (
            <div
              onClick={() => {
                setCurrentPrice(+usdtTickToKrw(currentTick!, chainId));
                setSelectedPosition({
                  apr,
                  lowerTick,
                  upperTick,
                  label,
                  currentPrice: +usdtTickToKrw(currentTick!, chainId),
                });
              }}
              key={label}
            >
              <Position
                dexIcon={
                  DEX_ICON_MAP[
                    checkIsAvailableChain(chainId) ? chainId : defaultChain.id
                  ]
                }
                label={label}
                lowerTick={lowerTick}
                upperTick={upperTick}
                apr={apr}
                isSelected={isSelected}
              />
            </div>
          );
        })}
      </section>
      <PositionButton selectedPosition={selectedPosition} />
    </>
  );
}
