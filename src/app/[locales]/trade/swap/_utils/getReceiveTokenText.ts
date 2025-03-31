import { GetSwapRouteResponseType } from '@/src/lib/types/api/swap/GetSwapRouteType';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';

interface GetReceiveTokenTextProps {
  KRWOToken: TokenListType | undefined;
  receiveToken: TokenListType | undefined;
  routes: GetSwapRouteResponseType | undefined;
  krwoValue: string;
  oppositeToken: TokenListType | undefined;
}

export const getReceiveTokenText = ({
  KRWOToken,
  receiveToken,
  routes,
  krwoValue,
  oppositeToken,
}: GetReceiveTokenTextProps) => {
  if (
    !KRWOToken ||
    !receiveToken ||
    !KRWOToken.amount ||
    !receiveToken.amount ||
    !routes ||
    !oppositeToken
  )
    return '-';

  return `1 KRWO = ${krwoValue} ${oppositeToken.symbol}`;
};
