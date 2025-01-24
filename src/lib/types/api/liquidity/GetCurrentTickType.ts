export interface GetCurrentTickRequestType {
  chainId: number;
  token: string;
}

export interface GetCurrentTickResponseType {
  currentTick: number;
}
