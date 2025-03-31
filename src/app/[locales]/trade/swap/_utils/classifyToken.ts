import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';

interface ClassifyKRWOTokenProps {
  payToken: TokenListType | undefined;
  setPayToken?: React.Dispatch<React.SetStateAction<TokenListType | undefined>>;
  receiveToken: TokenListType | undefined;
  setReceiveToken?: React.Dispatch<
    React.SetStateAction<TokenListType | undefined>
  >;
}

export const classifyToken = ({
  payToken,
  receiveToken,
  setPayToken,
  setReceiveToken,
}: ClassifyKRWOTokenProps) => {
  if (payToken?.symbol === 'KRWO') {
    return {
      KRWOToken: payToken,
      setKRWOToken: setPayToken,
      oppositeToken: receiveToken,
      setOppositeToken: setReceiveToken,
    };
  } else {
    return {
      KRWOToken: receiveToken,
      setKRWOToken: setReceiveToken,
      oppositeToken: payToken,
      setOppositeToken: setPayToken,
    };
  }
};
