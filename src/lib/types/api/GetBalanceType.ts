export interface GetBalanceResponseType {
  balance: {
    krwo: number;
    ov: number;
  };
}

export interface GetBalanceRequestType {
  walletAddress: `0x${string}`;
}
