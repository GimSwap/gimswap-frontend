export interface GetBalanceResponseType {
  balance: {
    [key: string]: string;
    krwo: string;
    ov: string;
    usdt: string;
    native: string;
    reward: string;
  };
}

export interface GetBalanceRequestType {
  walletAddress: `0x${string}`;
  chainId: number;
}
