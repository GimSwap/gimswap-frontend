import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';

interface UseHandleTokenAmountProps {
  type: 'pay' | 'receive';
}

interface HandleChangeTokenAmountProps {
  amount: string;
  setSelectedToken: React.Dispatch<
    React.SetStateAction<TokenListType | undefined>
  >;
  tokens: {
    pay: TokenListType | undefined;
    receive: TokenListType | undefined;
  };
}

interface HandleMaxTokenAmountProps {
  maxAmount: string;
  setSelectedToken: React.Dispatch<
    React.SetStateAction<TokenListType | undefined>
  >;
  tokens: {
    pay: TokenListType | undefined;
    receive: TokenListType | undefined;
  };
  networkCost: number;
}

export const useHandleTokenAmount = ({ type }: UseHandleTokenAmountProps) => {
  const handleChangeTokenAmount = ({
    amount,
    setSelectedToken,
    tokens,
  }: HandleChangeTokenAmountProps) => {
    let trimmedAmount = amount.trim();
    if (isNaN(Number(trimmedAmount))) return;

    const regex = new RegExp(`^\\d*(\\.\\d{0,${tokens[type]?.decimals}})?$`);

    if (!regex.test(trimmedAmount)) return;

    if (/^0+$/.test(trimmedAmount)) {
      trimmedAmount = '0';
    } else if (
      trimmedAmount.startsWith('0') &&
      !trimmedAmount.startsWith('0.')
    ) {
      trimmedAmount = trimmedAmount.replace(/^0+/, '');
    }

    setSelectedToken((prev) => ({
      ...prev!,
      amount: trimmedAmount,
    }));

    if (tokens[type]?.amount === trimmedAmount) return;
  };

  const handleMax = ({
    maxAmount,
    setSelectedToken,
    tokens,
    networkCost,
  }: HandleMaxTokenAmountProps) => {
    if (tokens.pay?.key === 'native') {
      const chainId = tokens.pay?.chainId;
      if (!chainId || !checkIsAvailableChain(chainId)) return;

      const networkCostSubtractedAmount = safeCalc
        .subtract(maxAmount, networkCost)
        .toString();

      setSelectedToken((prev) => {
        if (!prev) return prev;

        if (+networkCostSubtractedAmount < 0) {
          return {
            ...prev,
            amount: '0',
          };
        }

        return {
          ...prev,
          amount: networkCostSubtractedAmount,
        };
      });
    } else {
      setSelectedToken((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          amount: maxAmount,
        };
      });
    }
  };

  return { handleChangeTokenAmount, handleMax };
};
