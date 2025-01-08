export interface GetLiquidityGraphInfoRequestType {
  chainId: number;
  tokenId: 'usdt';
}

export interface GetLiquidityGraphInfoResponseType {
  minTick: number;
  currentTick: number;
  liquidity: string[];
  tickSpacing: number;
}
