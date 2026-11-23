import { Fetch } from '../fetchClient';
import { GetRecommendPositionResponseType } from '@/src/lib/types/api/liquidity/GetRecommendPositionType';
export const fetchGetRecommendPositions = async (
  chainId: number,
): Promise<GetRecommendPositionResponseType> => {
  return await Fetch(`/liquidity/recommend?chain_id=${chainId}`);
};
