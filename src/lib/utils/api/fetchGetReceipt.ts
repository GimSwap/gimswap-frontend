import {
  GetTransferReceiptRequestType,
  GetTransferReceiptResponseType,
} from '../../types/api/swift/TransferType';
import { Fetch } from './fetchClient';

export const fetchGetTransferReceipt = async (
  params: GetTransferReceiptRequestType,
): Promise<GetTransferReceiptResponseType> => {
  return Fetch(`/tx/${params.txHash}?chain_id=${params.chainId}`);
};
