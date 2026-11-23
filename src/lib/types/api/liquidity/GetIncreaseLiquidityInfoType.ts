export interface GetIncreaseLiquidityInfoRequestType {
  chainId: number;
  tokenId: number;
  autoSwap: boolean;
  amount0: string;
  amount1: string;
}

export interface GetIncreaseLiquidityInfoResponseType {
  data: `0x${string}`;
  amount0: string;
  amount1: string;
  contractAddress: `0x${string}`;
}
