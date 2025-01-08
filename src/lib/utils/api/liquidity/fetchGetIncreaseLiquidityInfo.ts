import { Fetch } from '../fetchClient';
import {
  GetIncreaseLiquidityInfoRequestType,
  GetIncreaseLiquidityInfoResponseType,
} from '@/src/lib/types/api/liquidity/GetIncreaseLiquidityInfoType';

export const fetchGetIncreaseLiquidityInfo = async ({
  amount0,
  amount1,
  autoSwap,
  chainId,
  tokenId,
}: GetIncreaseLiquidityInfoRequestType): Promise<GetIncreaseLiquidityInfoResponseType> => {
  return await Fetch(
    `/liquidity/increase?${new URLSearchParams({
      chain_id: chainId.toString(),
      token_id: tokenId.toString(),
      auto_swap: autoSwap.toString(),
      amount0: amount0,
      amount1: amount1,
    })}`,
  );
};
