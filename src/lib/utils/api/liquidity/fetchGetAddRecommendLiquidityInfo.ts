import {
  GetAddRecommendLiquidityInfoRequestType,
  GetAddRecommendLiquidityInfoResponseType,
} from '@/src/lib/types/api/liquidity/GetAddRecommendLiquidityInfoType';
import { Fetch } from '../fetchClient';

export const fetchGetAddRecommendLiquidityInfo = async ({
  amount0,
  amount1,
  autoSwap,
  chainId,
  lowerTick,
  upperTick,
}: GetAddRecommendLiquidityInfoRequestType): Promise<GetAddRecommendLiquidityInfoResponseType> => {
  return await Fetch(
    `/liquidity/add?${new URLSearchParams({
      chain_id: chainId.toString(),
      lower_tick: lowerTick.toString(),
      upper_tick: upperTick.toString(),
      auto_swap: autoSwap.toString(),
      amount0: amount0,
      amount1: amount1,
    })}`,
  );
};
