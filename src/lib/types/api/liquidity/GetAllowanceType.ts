export interface GetAllowanceRequestType {
  chainId: number;
  token: 'usdt' | 'krwo';
  walletAddress: `0x${string}`;
}

export interface GetAllowanceResponseType {
  allowance: string;
  spenderAddress: `0x${string}`;
}
