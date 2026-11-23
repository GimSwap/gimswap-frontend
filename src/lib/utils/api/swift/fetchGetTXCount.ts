import { Fetch } from '../fetchClient';

export const fetchGetTXCount = async ({ chainId }: { chainId: number }) => {
  return Fetch(`/swift/transfer/count?chain_id=${chainId}`);
};
