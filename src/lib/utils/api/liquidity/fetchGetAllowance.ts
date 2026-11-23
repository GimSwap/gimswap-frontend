import {
  GetAllowanceRequestType,
  GetAllowanceResponseType,
} from '@/src/lib/types/api/liquidity/GetAllowanceType';
import { Fetch } from '../fetchClient';

export const fetchGetAllowance = async ({
  chainId,
  token,
  walletAddress,
}: GetAllowanceRequestType): Promise<GetAllowanceResponseType> => {
  return Fetch(
    `/liquidity/allowance?chain_id=${chainId}&token=${token}&wallet_address=${walletAddress}`,
  );
};
