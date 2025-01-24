import { useRef, useEffect } from 'react';
import { DrawChart } from '@/src/lib/utils/chart/drawChart';
import { usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { GetLiquidityGraphInfoResponseType } from '@/src/lib/types/api/liquidity/GetLiquidityGraphInfo';
import { insertComma } from '@/src/lib/utils/insertComma';
import { PositionType } from '@/src/lib/stores/liquidityStore/liquidityStore';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { useAccount } from 'wagmi';
import { defaultChain } from '@/src/lib/constants/token';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { TOKEN_MAP } from '@/src/lib/constants/token';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { useToolTip } from '@/src/lib/hook/useToolTip';
import QuestionMarkIcon from '@/public/svg/circle-question-purple-small.svg';

interface RangeChartProps {
  selectedPosition: Omit<PositionType, 'label'>;
  graphInfo: GetLiquidityGraphInfoResponseType | undefined;
}

export default function RangeChart({
  selectedPosition,
  graphInfo,
}: RangeChartProps) {
  const { chainId } = useAccount();
  const parentRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<DrawChart | null>(null);
  const { openTooltip, Tooltip } = useToolTip();

  const calcPrice = (tick: number | string) => {
    if (!chainId || !tick) return '-';
    return insertComma(formatNumber(usdtTickToKrw(tick, chainId), 0));
  };

  useEffect(() => {
    if (!chainId || !chartRef.current || !parentRef.current || !graphInfo)
      return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const _liquidities =
      TOKEN_MAP[checkIsAvailableChain(chainId) ? chainId : defaultChain.id]
        .native.fee === 0.2
        ? graphInfo.liquidity
        : (() => {
            const newLiquidities = [];
            for (let i = 0; i < graphInfo.liquidity.length; i += 40) {
              const chunk = graphInfo.liquidity.slice(i, i + 40);
              const sum = chunk.reduce(
                (acc, liquidity) => safeCalc.add(acc, liquidity).toString(),
                '0',
              );
              newLiquidities.push(sum);
            }
            return newLiquidities;
          })();

    if (chartInstanceRef.current) {
      chartInstanceRef.current.updateChart(
        ctx,
        selectedPosition.lowerTick,
        selectedPosition.upperTick,
        +usdtTickToKrw(graphInfo?.currentTick!, chainId),
        _liquidities,
      );
    } else {
      chartInstanceRef.current = new DrawChart({
        liquidities: _liquidities,
        canvas: chartRef.current,
        parent: parentRef.current,
        selectedMinTick: selectedPosition.lowerTick,
        selectedMaxTick: selectedPosition.upperTick,
        minTick: graphInfo.minTick,
        currentPrice: +usdtTickToKrw(graphInfo?.currentTick!, chainId),
        tickSpacing: 40,
        chainId,
      });
    }
  }, [selectedPosition, graphInfo, chainId]);

  return (
    <>
      <section className="flex flex-row justify-between pb-1">
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-1 items-center">
            <div className="w-3 h-[12px] rounded-[4px] bg-purple-200" />
            <p className="c1 text-black-8">
              Range
              <span className="font-bold">
                {` ₩ ${calcPrice(selectedPosition.lowerTick)} ~ ₩ ${calcPrice(
                  selectedPosition.upperTick,
                )}`}
              </span>
            </p>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <div className="w-3 h-[12px] rounded-[4px] bg-purple-500" />
            <p className="c1 text-black-8">
              Current Price
              <span className="font-bold">
                {` ₩ ${calcPrice(graphInfo?.currentTick!)}`}
              </span>
            </p>
          </div>
        </div>
        <div
          className="inline-flex justify-center items-center gap-[2px] c1 font-medium px-2 py-1 rounded-full border border-purple-500 w-fit text-purple-500 h-[fit-content]"
          onClick={openTooltip}
        >
          <QuestionMarkIcon />
          <Tooltip className="whitespace-nowrap bg-[rgba(0,0,0,0.5)] rounded-lg px-3 py-[6px] text-black-1 c1 after:left-[58.5%] -translate-x-[50px] translate-y-[75px]">
            This figure is based on the last <br />
            24 hours' trading volume and <br />
            may change due to factors like <br />
            total liquidity and additional <br />
            liquidity. It does not guarantee <br />
            returns and is for reference only.
          </Tooltip>
          <p>APR ≈ {Math.floor(selectedPosition.apr * 100)}%</p>
        </div>
      </section>
      <div ref={parentRef} className="w-full aspect-[5/1]">
        <canvas ref={chartRef} style={{ width: '0', height: '0' }} />
      </div>
    </>
  );
}
