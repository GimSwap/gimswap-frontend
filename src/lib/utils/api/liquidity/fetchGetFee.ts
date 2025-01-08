import {
  GetFeeRequestType,
  GetFeeResponseType,
} from '@/src/lib/types/api/liquidity/GetFeeType';
import { Fetch } from '../fetchClient';

export const fetchGetFee = async ({
  chainId,
  tokenId,
}: GetFeeRequestType): Promise<GetFeeResponseType> => {
  return await Fetch(`/liquidity/fee?chain_id=${chainId}&token_id=${tokenId}`);
};
