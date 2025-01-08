export interface GetBalanceResponseType {
  balance: {
    krwo: string;
    ov: string;
    usdt: string;
  };
}

export interface GetBalanceRequestType {
  walletAddress: `0x${string}`;
}
