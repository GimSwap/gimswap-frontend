import { Fetch } from '../fetchClient';
import {
  GetFeeRequestType,
  GetFeeResponseType,
} from '@/src/lib/types/api/swift/GetFeeType';

export const fetchGetFee = async (
  params: GetFeeRequestType,
): Promise<GetFeeResponseType> => {
  return Fetch(
    `/swift/transfer/fee?${new URLSearchParams({
      chain_id: params.chainId.toString(),
    })}`,
  );
};
