export interface GetAddRecommendLiquidityInfoRequestType {
  chainId: number;
  lowerTick: number;
  upperTick: number;
  autoSwap: boolean;
  amount0: string;
  amount1: string;
}

export interface GetAddRecommendLiquidityInfoResponseType {
  data: `0x${string}`;
  amount0: string;
  amount1: string;
  contractAddress: `0x${string}`;
}
