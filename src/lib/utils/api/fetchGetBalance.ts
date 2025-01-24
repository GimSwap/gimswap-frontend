import { cache } from 'react';
import { Fetch } from './fetchClient';
import {
  GetBalanceRequestType,
  GetBalanceResponseType,
} from '@/src/lib/types/api/GetBalanceType';

export const fetchGetBalance = cache(
  async (params: GetBalanceRequestType): Promise<GetBalanceResponseType> => {
    return Fetch(
      `/token/balance?chain_id=${params.chainId}&wallet_address=${params.walletAddress}`,
    );
  },
);
