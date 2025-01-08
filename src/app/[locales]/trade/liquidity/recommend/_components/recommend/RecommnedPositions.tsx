'use client';

import { GetRecommendPositionResponseType } from '@/src/lib/types/api/liquidity/GetRecommendPositionType';
import Position from './Position';
import PositionButton from './PositionButton';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import { usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { formatNumber } from '@/src/lib/utils/formatNumber';

interface RecommendPositionsProps {
  positions: GetRecommendPositionResponseType['liquidity'];
  currentTick: number;
}

export default function RecommendPositions({
  positions,
  currentTick,
}: RecommendPositionsProps) {
  const { selectedPosition, setSelectedPosition, setCurrentPrice } =
    useLiquidityStore((state) => state);
  return (
    <>
      <section className="flex flex-col gap-2">
        {positions.map(({ apr, lowerTick, upperTick, label }) => {
          const isSelected = selectedPosition?.label === label;
          return (
            <div
              onClick={() => {
                setCurrentPrice(+usdtTickToKrw(currentTick));
                setSelectedPosition({
                  apr,
                  lowerTick,
                  upperTick,
                  label,
                  currentPrice: +usdtTickToKrw(currentTick),
                });
              }}
              key={label}
            >
              <Position
                label={label}
                lowerTick={+formatNumber(usdtTickToKrw(lowerTick), 0)}
                upperTick={+formatNumber(usdtTickToKrw(upperTick), 0)}
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
