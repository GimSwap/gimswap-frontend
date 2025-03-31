export interface ReceiveAndSwapRequestType {
  chainId: number;
  amountIn: string;
  signature: string;
  nonce: string;
  validAfter: number;
  validBefore: number;
  recipient: string;
}

export interface ReceiveAndSwapResponseType {
  txHash: `0x${string}`;
}
