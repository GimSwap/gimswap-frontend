export interface GetCollectInfoRequestType {
  chainId: number;
  tokenId: number;
  walletAddress: `0x${string}`;
}

export interface GetCollectInfoResponseType {
  data: `0x${string}`;
  contractAddress: `0x${string}`;
}
