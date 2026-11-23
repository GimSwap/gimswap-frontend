export interface GetSwapRouteRequestType {
  chainId: number;
  executor: string;
  from: string;
  to: string;
  amount: string;
  exactInput: boolean;
}

export interface GetSwapRouteResponseType {
  data: `0x${string}`;
  contractAddress: `0x${string}`;
  amount: string;
  saved: number;
  fromTokenAllowance: string;
  highPriceImpact?: boolean;
  effectivePrice: string;
  routes: {
    ratio: number;
    paths: {
      tokens: string[];
      fee: number;
    }[];
  }[];
}
