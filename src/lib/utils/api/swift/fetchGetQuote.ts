import {
  GetQuoteRequestType,
  GetQuoteResponseType,
} from '@/src/lib/types/api/swift/GetQuoteType';
import { Fetch } from '../fetchClient';

export const fetchGetQuote = async (
  params: GetQuoteRequestType,
): Promise<GetQuoteResponseType> => {
  return Fetch(
    `/swift/transfer/quote?${new URLSearchParams({
      chain_id: params.chainId.toString(),
      token_out: params.tokenOut,
      recipient: params.recipient,
      amount_in: params.amountIn,
    })}`,
  );
};
