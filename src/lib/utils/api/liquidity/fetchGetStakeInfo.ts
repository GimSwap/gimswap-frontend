import { GetStakeInfoRequestType } from '@/src/lib/types/api/liquidity/GetStakeInfoType';
import { Fetch } from '../fetchClient';

export const fetchGetStakeInfo = async ({
  chainId,
  tokenId,
  walletAddress,
}: GetStakeInfoRequestType) => {
  return Fetch(
    `/liquidity/stake?chain_id=${chainId}&token_id=${tokenId}&wallet_address=${walletAddress}`,
  );
};
