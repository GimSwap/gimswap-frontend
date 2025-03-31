import {
  GetTokenListRequestType,
  GetTokenListResponseType,
} from '@/src/lib/types/api/swap/GetTokenList';

export const fetchGetTokenList = async (
  params: GetTokenListRequestType,
): Promise<GetTokenListResponseType> => {
  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_KAKAO_BUCKECT_URL}/tokens/list/${params.chainId}.json`,
    )
  ).json();
};
