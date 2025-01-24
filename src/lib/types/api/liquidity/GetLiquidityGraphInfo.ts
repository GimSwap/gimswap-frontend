export interface GetLiquidityGraphInfoRequestType {
  chainId: number;
  token: 'usdt';
}

export interface GetLiquidityGraphInfoResponseType {
  minTick: number;
  currentTick: number;
  liquidity: string[];
  tickSpacing: number;
}
