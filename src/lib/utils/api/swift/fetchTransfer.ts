import {
  TransferRequestType,
  TransferResponseType,
} from '@/src/lib/types/api/swift/TransferType';
import { Fetch } from '../fetchClient';
import { snakeCase } from 'change-case/keys';

export const fetchTransfer = async (
  params: TransferRequestType,
): Promise<TransferResponseType> => {
  const { chainId, tokenOut, ...bodyParams } = params;
  return Fetch(`/swift/transfer?chain_id=${chainId}&token_out=${tokenOut}`, {
    method: 'POST',
    body: JSON.stringify(snakeCase(bodyParams)),
  });
};
