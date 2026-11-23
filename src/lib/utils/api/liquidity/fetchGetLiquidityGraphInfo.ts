import {
  GetLiquidityGraphInfoRequestType,
  GetLiquidityGraphInfoResponseType,
} from '@/src/lib/types/api/liquidity/GetLiquidityGraphInfo';
import { Fetch } from '../fetchClient';

export const fetchGetLiquidityGraphInfo = async ({
  chainId,
  token,
}: GetLiquidityGraphInfoRequestType): Promise<GetLiquidityGraphInfoResponseType> => {
  return await Fetch(`/liquidity/graph?chain_id=${chainId}&token=${token}`);
};
