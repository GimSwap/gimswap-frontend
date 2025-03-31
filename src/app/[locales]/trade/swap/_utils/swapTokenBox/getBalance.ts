import { applyDecimals } from '@/src/lib/utils/calcTick';
import { GetBalanceResponseType } from '@/src/lib/types/api/GetBalanceType';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';

interface GetBalanceProps {
  balance: GetBalanceResponseType['balance'] | undefined;
  tokens: {
    pay: TokenListType | undefined;
    receive: TokenListType | undefined;
  };
  type: 'pay' | 'receive';
}

export const getBalance = ({ balance, tokens, type }: GetBalanceProps) => {
  if (!balance || !tokens[type]?.key) return '0';
  return applyDecimals(
    balance[tokens[type].key.toLowerCase()],
    tokens[type].decimals,
    18,
  );
};
