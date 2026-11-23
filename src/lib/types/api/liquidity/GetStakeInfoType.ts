export interface GetStakeInfoRequestType {
  chainId: number;
  tokenId: number;
  walletAddress: `0x${string}`;
}

export interface GetStakeInfoResponseType {
  data: `0x${string}`;
  contractAddress: `0x${string}`;
}
