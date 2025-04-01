import { GetSwapRouteResponseType } from '@/src/lib/types/api/swap/GetSwapRouteType';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { insertComma } from '@/src/lib/utils/insertComma';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { useEffect } from 'react';
import { useState } from 'react';

interface GetReceiveTokenTextProps {
  KRWOToken: TokenListType | undefined;
  routes: GetSwapRouteResponseType | undefined;
  oppositeToken: TokenListType | undefined;
  isDebouncing: boolean;
  isPending: boolean;
  outputAmount: string | undefined;
}

export const useGetReceiveTokenText = ({
  KRWOToken,
  oppositeToken,
  isDebouncing,
  isPending,
  outputAmount,
}: GetReceiveTokenTextProps) => {
  const [cachedAmount, setCachedAmount] = useState<string | undefined>();
  const [cachedOutputAmount, setCachedOutputAmount] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (
      isDebouncing ||
      isPending ||
      !KRWOToken ||
      !oppositeToken ||
      !outputAmount ||
      cachedOutputAmount === outputAmount
    ) {
      return;
    }

    if (oppositeToken?.amount && KRWOToken?.amount) {
      setCachedAmount(
        safeCalc.divide(KRWOToken.amount!, oppositeToken.amount).toString(),
      );
      setCachedOutputAmount(outputAmount);
    }
  }, [isDebouncing, isPending]);

  if (!cachedAmount || !oppositeToken)
    return {
      receiveTokenText: '-',
    };

  return {
    receiveTokenText: `1 ${oppositeToken.symbol} = ${insertComma(
      formatNumber(cachedAmount, 6),
    )} KRWO`,
  };
};
