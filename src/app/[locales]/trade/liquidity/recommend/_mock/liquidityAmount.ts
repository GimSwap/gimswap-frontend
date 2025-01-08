export const liquidityAmount = {
  recommend: 4,
  'my-position': 2,
};

export const mockCurrentPrice = 1388;

export const mockRecommendPositions = {
  liquidity: [
    {
      lowerTick: 1372,
      upperTick: 1399,
      label: 'Broad',
      apr: 10.2,
    },
    {
      lowerTick: 1372,
      upperTick: 1399,
      label: 'Narrow',
      apr: 10.2,
    },
    {
      lowerTick: 1372,
      upperTick: 1399,
      label: 'Uptrend',
      apr: 10.2,
    },
    {
      lowerTick: 1372,
      upperTick: 1399,
      label: 'Downtrend',
      apr: 10.2,
    },
  ],
} as const;

export interface PositionType {
  label: string;
  lowerTick: number;
  upperTick: number;
  apr: number;
  currentPrice: number;
}
