import { Fetch } from './fetchClient';
import { GetBlockAmountResponseType } from '@/src/lib/types/api/GetBlockAmountType';

export const fetchGetBlockAmount = async (
  chainId: number,
): Promise<GetBlockAmountResponseType> => {
  return Fetch(`/locked?chain_id=${chainId}`);
};
