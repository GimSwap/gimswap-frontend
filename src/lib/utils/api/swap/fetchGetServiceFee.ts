import { Fetch } from '../fetchClient';
import { GetServiceFeeRequestType } from '@/src/lib/types/api/swap/GetServiceFeeType';

export const fetchGetServiceFee = (params: GetServiceFeeRequestType) => {
  return Fetch(`/swap/fee?chain_id=${params.chainId}`);
};
