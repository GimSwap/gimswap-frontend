import {
  ReceiveAndSwapRequestType,
  ReceiveAndSwapResponseType,
} from '@/src/lib/types/api/swap/ReceiveAndSwapType';
import { Fetch } from '../fetchClient';
import { snakeCase } from 'change-case/keys';

export const fetchReceiveAndSwap = async (
  params: ReceiveAndSwapRequestType,
): Promise<ReceiveAndSwapResponseType> => {
  const { chainId, ...bodyParams } = params;
  return Fetch(`/swap?chain_id=${chainId}`, {
    method: 'POST',
    body: JSON.stringify(snakeCase(bodyParams)),
  });
};
