import { createToken } from '../utils/factory/token';

export type AbiMethodType = 'transferVoucherAndCall' | 'transferAndCall';

export type TokenType = ReturnType<typeof createToken>;
