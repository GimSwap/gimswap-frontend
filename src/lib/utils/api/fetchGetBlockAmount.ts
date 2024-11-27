import { Fetch } from "./fetchClient";
import { GetBlockAmountResponseType } from "@/src/lib/types/api/GetBlockAmountType";

export const fetchGetBlockAmount = async (): Promise<GetBlockAmountResponseType> => {
  const chainId = process.env.NEXT_PUBLIC_KLAYTN_CHAIN_ID!;
  return Fetch(`/locked?chain_id=${+chainId}`);
};
