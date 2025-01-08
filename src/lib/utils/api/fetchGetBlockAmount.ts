import { Fetch } from './fetchClient';
import { GetBlockAmountResponseType } from '@/src/lib/types/api/GetBlockAmountType';

export const fetchGetBlockAmount =
  async (): Promise<GetBlockAmountResponseType> => {
    const chainId =
      process.env.NEXT_PUBLIC_ENV_MODE === 'production' ? 8217 : 1001;
    return Fetch(`/locked?chain_id=${chainId}`);
  };
