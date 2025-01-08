export interface GetFeeRequestType {
  chainId: number;
  tokenId: number;
}

export interface GetFeeResponseType {
  amount0: string;
  amount1: string;
}
