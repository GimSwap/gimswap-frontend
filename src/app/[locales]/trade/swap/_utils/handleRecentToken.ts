import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';

interface SetRecentUsedTokenRequestType {
  token: TokenListType;
  chainId: number;
}

export const getRecentUsedToken = async (
  chainId: number,
): Promise<TokenListType[] | []> => {
  const storedTokens = await localStorage.getItem(
    `recentUsedTokens-${chainId}`,
  );
  return storedTokens ? (JSON.parse(storedTokens) as TokenListType[]) : [];
};

export const setRecentUsedToken = async ({
  token,
  chainId,
}: SetRecentUsedTokenRequestType) => {
  const recentUsedTokens = await getRecentUsedToken(chainId);
  const updatedTokens = recentUsedTokens.filter(
    (t) => t.symbol !== token.symbol,
  );
  localStorage.setItem(
    `recentUsedTokens-${chainId}`,
    JSON.stringify([...updatedTokens, token]),
  );
};
