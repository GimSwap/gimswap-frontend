import { defaultChain } from '@/src/lib/constants/token';
import { KRWO } from '@/src/lib/constants/token';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';

export const RECEIVE_TOKEN_DEFAULT = (chainId: number): TokenListType => {
  return {
    contractAddress:
      KRWO.contractAddress[
        checkIsAvailableChain(chainId) ? chainId : defaultChain.id
      ],
    symbol: KRWO.symbol,
    decimals: KRWO.decimal,
    name: KRWO.name,
    chainId: chainId!,
    key: 'KRWO',
    amount: '0',
    krwValue: '0',
  };
};
