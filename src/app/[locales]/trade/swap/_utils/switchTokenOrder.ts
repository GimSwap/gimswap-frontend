import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';

interface SwitchTokenOrderProps {
  payToken: TokenListType | undefined;
  receiveToken: TokenListType | undefined;
  setPayToken: (token: TokenListType) => void;
  setReceiveToken: (token: TokenListType) => void;
  resetRoutes: () => void;
}

export const switchTokenOrder = ({
  payToken,
  receiveToken,
  setPayToken,
  setReceiveToken,
  resetRoutes,
}: SwitchTokenOrderProps) => {
  setPayToken({
    ...receiveToken!,
    amount: undefined,
  });

  setReceiveToken({
    ...payToken!,
    amount: undefined,
  });
  resetRoutes();
};
