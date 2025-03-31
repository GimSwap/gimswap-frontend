import { KRWO } from '@/src/lib/constants/token';
import { OPEN_VOUCHER } from '@/src/lib/constants/token';
import { TokenType } from '@/src/lib/types/TokenType';
import { useState } from 'react';

interface SelectedTokens {
  pay: TokenType;
  receive: TokenType;
}

export const useSwitchTokenOrder = () => {
  const [selectedTokens, setSelectedTokens] = useState<SelectedTokens>({
    pay: OPEN_VOUCHER,
    receive: KRWO,
  });

  const switchTokenOrder = () => {
    setSelectedTokens((prev) => ({
      pay: prev.receive,
      receive: prev.pay,
    }));
  };

  return { selectedTokens, switchTokenOrder };
};
