export interface GetRecommendPositionResponseType {
  liquidity: {
    lowerTick: number;
    upperTick: number;
    label: 'Broad' | 'Narrow' | 'Uptrend' | 'Downtrend';
    apr: number;
  }[];
}
