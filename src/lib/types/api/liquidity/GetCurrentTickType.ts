export interface GetCurrentTickRequestType {
  chainId: number;
  token: 'usdt';
}

export interface GetCurrentTickResponseType {
  currentTick: number;
}
