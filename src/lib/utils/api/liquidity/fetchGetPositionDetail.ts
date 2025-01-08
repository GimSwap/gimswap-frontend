import {
  GetMyPositionDetailRequestType,
  GetPositionDetailResponseType,
} from '@/src/lib/types/api/liquidity/GetPositionType';
import { Fetch } from '../fetchClient';

export const fetchGetMyPositionDetail = async ({
  chainId,
  tokenId,
}: GetMyPositionDetailRequestType): Promise<GetPositionDetailResponseType> => {
  return await Fetch(
    `/liquidity/position?chain_id=${chainId}&token_id=${tokenId}`,
  );
};
