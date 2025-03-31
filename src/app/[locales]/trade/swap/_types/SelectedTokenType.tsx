import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';

export interface SelectedTokenType {
  pay: TokenListType | undefined;
  receive: TokenListType | undefined;
}
