import { TokenType } from '@/src/lib/types/TokenType';
import { safeCalc } from '@/src/lib/utils/safeCalc';

interface HandleMaxProps {
  balance: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  token: TokenType;
}

export const handleMax = ({ balance, setAmount, token }: HandleMaxProps) => {
  if (!balance || !setAmount) return;

  const multipliedBalance = safeCalc.multiply(balance, token.unit);
  const asDecimal = safeCalc.divide(multipliedBalance.toFixed(), 10000);

  const truncatedAmount = Math.floor(Number(asDecimal));

  setAmount(safeCalc.multiply(truncatedAmount, 10000).toFixed());
};
