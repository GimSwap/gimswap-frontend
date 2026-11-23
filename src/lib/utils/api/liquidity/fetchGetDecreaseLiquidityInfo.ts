import {
  GetRemoveLiquidityInfoRequestType,
  GetRemoveLiquidityInfoResponseType,
} from '@/src/lib/types/api/liquidity/GetRemoveLiquidityInfo';
import { Fetch } from '../fetchClient';

export const fetchGetDecreaseLiquidityInfo = async ({
  chainId,
  tokenId,
  liquidity,
  walletAddress,
}: GetRemoveLiquidityInfoRequestType): Promise<GetRemoveLiquidityInfoResponseType> => {
  return await Fetch(
    `/liquidity/decrease?${new URLSearchParams({
      chain_id: chainId.toString(),
      token_id: tokenId.toString(),
      liquidity: liquidity,
      wallet_address: walletAddress,
    })}`,
  );
};
