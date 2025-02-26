export interface TransferRequestType {
  chainId: number;
  amountIn: string;
  amountOut: string;
  tokenOut: string;
  signature: string;
  nonce: string;
  validAfter: number;
  validBefore: number;
  recipient: string;
}

export interface TransferResponseType {
  txHash: `0x${string}`;
}

export interface TransferErrorType {
  code: number;
  message: string;
}

export interface GetTransferReceiptRequestType {
  chainId: number;
  txHash: `0x${string}`;
}

export interface GetTransferReceiptResponseType {
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  logs: {
    transactionHash: `0x${string}`;
    address: `0x${string}`;
    blockHash: `0x${string}`;
    blockNumber: string;
    data: string;
    logIndex: string;
    removed: boolean;
    topics: `0x${string}`[];
  }[];
}
