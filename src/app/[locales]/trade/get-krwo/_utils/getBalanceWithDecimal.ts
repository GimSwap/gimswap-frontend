import { safeCalc } from '@/src/lib/utils/safeCalc';

interface GetBalanceWithDecimalProps {
  balance: string | undefined;
  decimal: number;
}

export const getBalanceWithDecimal = ({
  balance,
  decimal,
}: GetBalanceWithDecimalProps) => {
  return balance ? safeCalc.divide(balance, 10 ** decimal).toString() : '0';
};
