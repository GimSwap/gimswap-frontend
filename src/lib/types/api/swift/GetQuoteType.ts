export interface GetQuoteRequestType {
  chainId: number;
  tokenOut: string;
  recipient: string;
  amountIn: string;
}

export interface GetQuoteResponseType {
  amountOut: string;
}
