import { KRWO, USDT } from '@/src/lib/constants/token';
import { safeCalc } from '../../safeCalc';
import { BAR_PADDING, BAR_WIDTH } from '../_constants/chartConstants';
import { ChainIdType } from '@/src/lib/types/ChainIdType';

export const calculateTicks = (
  minTick: number,
  tickSpacing: number,
  liquidityLength: number,
  chainId: number,
) => {
  const ticks: number[] = [];
  const decimal = USDT.decimal[chainId as ChainIdType] - KRWO.decimal;
  for (let i = 0; i < liquidityLength + 1; i++) {
    const price = safeCalc.multiply(
      safeCalc.pow(1.0001, tickSpacing * i + minTick).toString(),
      10 ** decimal,
    );
    ticks.push(+price);
  }
  return ticks;
};

export const calculateBarHeight = (
  liquidity: string,
  minTick: string,
  maxTick: string,
  graphHeight: number,
) => {
  const difference = safeCalc.subtract(maxTick, minTick).toString();
  if (difference === '0') return graphHeight.toString();

  const height = safeCalc
    .multiply(
      safeCalc
        .divide(
          safeCalc.subtract(liquidity, minTick).toFixed(),
          safeCalc.subtract(maxTick, minTick).toFixed(),
        )
        .toFixed(),
      graphHeight,
    )
    .toFixed();

  const numericHeight = +height;
  if (numericHeight > 0 && numericHeight < 10) return '10';
  if (numericHeight === 0) return '0';
  return height;
};

export const calculateRatio = (
  value: number,
  minTick: number,
  maxTick: number,
) => {
  return (value - minTick) / (maxTick - minTick);
};

export const calculateBarPositions = (
  liquidities: string[],
  graphWidth: number,
  minTick: string,
  maxTick: string,
  graphHeight: number,
  selectedMinTick: string,
  selectedMaxTick: string,
  ticks: number[],
  activeBarColor: string,
  disabledBarColor: string,
  chainId: number,
) => {
  const barSpacing =
    (graphWidth - BAR_WIDTH * liquidities.length - BAR_PADDING * 2) /
    (liquidities.length - 1);

  let activeMinX = Infinity;
  let activeMaxX = -Infinity;

  return {
    barPositions: liquidities.map((liquidity, index) => {
      const tickStart = Math.floor(ticks[index]);
      const tickEnd = Math.floor(ticks[index + 1]);

      const isActive =
        chainId === 8217
          ? tickEnd <= Math.floor(+selectedMaxTick) &&
            tickStart >= Math.floor(+selectedMinTick)
          : tickEnd >= Math.floor(+selectedMinTick) &&
            tickStart <= Math.floor(+selectedMaxTick);

      const x = index * (barSpacing + BAR_WIDTH) + BAR_PADDING;

      if (isActive) {
        activeMinX = Math.min(activeMinX, x);
        activeMaxX = Math.max(activeMaxX, x);
      }

      return {
        x,
        height: calculateBarHeight(liquidity, minTick, maxTick, graphHeight),
        color: isActive ? activeBarColor : disabledBarColor,
      };
    }),
    activeMinX,
    activeMaxX,
  };
};
