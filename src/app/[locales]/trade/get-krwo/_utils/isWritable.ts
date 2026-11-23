import { OPEN_VOUCHER } from '@/src/lib/constants/token';
import { TokenType } from '@/src/lib/types/TokenType';

export const isWritable = (token: TokenType) => {
  return token === OPEN_VOUCHER;
};
