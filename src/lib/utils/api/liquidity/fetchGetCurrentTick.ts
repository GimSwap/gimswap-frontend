import {
  GetCurrentTickRequestType,
  GetCurrentTickResponseType,
} from '@/src/lib/types/api/liquidity/GetCurrentTickType';
import { Fetch } from '../fetchClient';

export const fetchGetCurrentTick = async (
  params: GetCurrentTickRequestType,
): Promise<GetCurrentTickResponseType> => {
  return await Fetch(
    `/liquidity/current?chain_id=${params.chainId}&token=${params.token}`,
  );
};
