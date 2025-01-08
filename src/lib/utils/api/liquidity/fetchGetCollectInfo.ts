import {
  GetCollectInfoRequestType,
  GetCollectInfoResponseType,
} from '@/src/lib/types/api/liquidity/GetCollectInfoType';
import { Fetch } from '../fetchClient';

export const fetchGetCollectInfo = async ({
  chainId,
  tokenId,
  walletAddress,
}: GetCollectInfoRequestType): Promise<GetCollectInfoResponseType> => {
  return Fetch(
    `/liquidity/collect?chain_id=${chainId}&token_id=${tokenId}&wallet_address=${walletAddress}`,
  );
};
