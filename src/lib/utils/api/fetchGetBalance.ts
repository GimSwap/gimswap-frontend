import { Fetch } from './fetchClient';
import {
  GetBalanceRequestType,
  GetBalanceResponseType,
} from '@/src/lib/types/api/GetBalanceType';

export const fetchGetBalance = async (
  params: GetBalanceRequestType,
): Promise<GetBalanceResponseType> => {
  const chainId = process.env.NEXT_PUBLIC_KLAYTN_CHAIN_ID!;
  return Fetch(
    `/token/balance?chain_id=${+chainId}&wallet_address=${params.walletAddress}`,
  );
};
