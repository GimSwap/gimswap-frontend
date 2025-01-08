export interface GetRemoveLiquidityInfoRequestType {
  chainId: number;
  tokenId: number;
  liquidity: string;
  walletAddress: `0x${string}`;
}

export interface GetRemoveLiquidityInfoResponseType {
  data: `0x${string}`;
  amount0: string;
  amount1: string;
  contractAddress: `0x${string}`;
}
