import { TokenType } from '@/src/lib/types/TokenType';
import { safeCalc } from '@/src/lib/utils/safeCalc';

interface HandleTokenInputProps {
  value: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  token: TokenType;
  setIsEnoughBalance?: React.Dispatch<React.SetStateAction<boolean>>;
  balance: string;
}

export const handleTokenInput = ({
  value,
  setAmount,
  token,
  setIsEnoughBalance,
  balance,
}: HandleTokenInputProps) => {
  if (isNaN(Number(value))) return;

  if (value.length > 18) return;
  setIsEnoughBalance?.(!!balance && safeCalc.isGreaterOrEqual(balance, value));
  setAmount(safeCalc.multiply(value, token.unit).toFixed());
};
