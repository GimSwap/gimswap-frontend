export interface GetTokenListRequestType {
  chainId: number;
}

export interface TokenListType {
  symbol: string;
  contractAddress: string;
  decimals: number;
  name: string;
  key: string;
  chainId: number;
  amount?: string;
  krwValue?: string;
}

export interface GetTokenListResponseType {
  tokens: TokenListType[];
}
