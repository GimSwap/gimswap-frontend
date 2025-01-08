import { GetMyPositionsResponseType } from '@/src/lib/types/api/liquidity/GetPositionType';
import { isrFetch } from '../fetchClient';
import { cache } from 'react';

export const MY_POSITION_REVALIDATE_TAG = 'liquidity-positions';

export const fetchGetMyPositions = cache(
  async (
    chainId: number,
    walletAddress: `0x${string}`,
  ): Promise<GetMyPositionsResponseType> => {
    return await isrFetch(
      `/liquidity/positions?chain_id=${chainId}&wallet_address=${walletAddress}`,
      1000,
      [MY_POSITION_REVALIDATE_TAG],
    );
  },
);
