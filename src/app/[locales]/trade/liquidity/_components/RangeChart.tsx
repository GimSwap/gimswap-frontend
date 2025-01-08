import { useRef, useEffect } from 'react';
import { DrawChart } from '@/src/lib/utils/chart/drawChart';
import { usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { GetLiquidityGraphInfoResponseType } from '@/src/lib/types/api/liquidity/GetLiquidityGraphInfo';
import { insertComma } from '@/src/lib/utils/insertComma';
import { PositionType } from '@/src/lib/stores/liquidityStore/liquidityStore';
import { formatNumber } from '@/src/lib/utils/formatNumber';

interface RangeChartProps {
  selectedPosition: Omit<PositionType, 'label'>;
  graphInfo: GetLiquidityGraphInfoResponseType | undefined;
}

export default function RangeChart({
  selectedPosition,
  graphInfo,
}: RangeChartProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<DrawChart | null>(null);

  useEffect(() => {
    if (!chartRef.current || !parentRef.current || !graphInfo) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.updateChart(
        ctx,
        selectedPosition.lowerTick,
        selectedPosition.upperTick,
        +usdtTickToKrw(graphInfo?.currentTick!),
        graphInfo?.liquidity,
      );
    } else {
      chartInstanceRef.current = new DrawChart({
        liquidities: graphInfo?.liquidity,
        canvas: chartRef.current,
        parent: parentRef.current,
        selectedMinTick: selectedPosition.lowerTick,
        selectedMaxTick: selectedPosition.upperTick,
        minTick: graphInfo.minTick,
        currentPrice: +usdtTickToKrw(graphInfo?.currentTick!),
        tickSpacing: graphInfo.tickSpacing,
      });
    }
  }, [selectedPosition, graphInfo]);

  return (
    <>
      <section className="flex flex-row justify-between pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-1 items-center">
            <div className="w-3 h-[12px] rounded-[4px] bg-purple-200" />
            <p className="c1 text-black-8">
              Range
              <span className="font-bold">
                {` ₩ ${insertComma(
                  formatNumber(usdtTickToKrw(selectedPosition.lowerTick), 0),
                )} ~ ₩ ${insertComma(
                  formatNumber(usdtTickToKrw(selectedPosition.upperTick), 0),
                )}`}
              </span>
            </p>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <div className="w-3 h-[12px] rounded-[4px] bg-purple-500" />
            <p className="c1 text-black-8">
              Current Price
              <span className="font-bold">
                {` ₩ ${insertComma(
                  formatNumber(usdtTickToKrw(graphInfo?.currentTick!), 0),
                )}`}
              </span>
            </p>
          </div>
        </div>
        <p className="c1 font-medium px-2 py-1 rounded-full border border-purple-500 w-fit text-purple-500 h-[fit-content]">
          APR ≈ {Math.floor(selectedPosition.apr * 100)}%
        </p>
      </section>
      <div ref={parentRef} className="w-full aspect-[5/1]">
        <canvas ref={chartRef} style={{ width: '0', height: '0' }} />
      </div>
    </>
  );
}
