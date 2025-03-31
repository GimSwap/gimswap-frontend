import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';

import { formatNumber } from '@/src/lib/utils/formatNumber';
import { safeCalc } from '@/src/lib/utils/safeCalc';

interface GetKRWOValueProps {
  oppositeToken: TokenListType | undefined;
  KRWOToken: TokenListType | undefined;
}

export const getKRWOValue = ({
  oppositeToken,
  KRWOToken,
}: GetKRWOValueProps) => {
  if (
    !oppositeToken ||
    !KRWOToken ||
    !oppositeToken.amount ||
    !KRWOToken.amount
  )
    return '0';

  return formatNumber(
    safeCalc.divide(oppositeToken.amount, KRWOToken.amount).toString(),
    6,
  );
};
