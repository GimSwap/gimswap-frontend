export interface GetBalanceResponseType {
  balance: {
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
