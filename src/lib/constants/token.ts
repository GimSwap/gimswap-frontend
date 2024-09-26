import { CONTRACT_ADDRESS } from './contractAddress';
import openVoucherIcon from '@/public/svg/token/open-voucher.svg';
import KRWOIcon from '@/public/svg/token/KRWO.svg';
import { TokenType } from '../types/TokenType';

export const EXCHANGE_RATE_DECIMAL_OV_TO_KRWO = 4;
export const SWAP_DECIMAL_OV_TO_KRWO = 6;

export const OPEN_VOUCHER: TokenType = {
  name: 'Open Voucher',
  unit: 10000,
  contractAddress: CONTRACT_ADDRESS.OpenVoucher,
  icon: openVoucherIcon,
  imageUrl: 'https://www.gimswap.com/svg/token/open-voucher.svg',
  symbol: 'OV',
  method: 'transferVoucherAndCall',
  decimal: 10,
};

export const KRWO: TokenType = {
  name: 'KRWO',
  unit: 1,
  contractAddress: CONTRACT_ADDRESS.KRWO,
  icon: KRWOIcon,
  imageUrl: 'https://www.gimswap.com/svg/token/KRWO.svg',
  symbol: 'KRWO',
  method: 'transferAndCall',
  decimal: 6,
};

export const KLAYTN = {
  chainId: 0x2019,
  chainName: 'Klaytn Cypress',
  blockExplorerUrl: process.env.NEXT_PUBLIC_KLAYTN_BLOCK_EXPLORER_URLS,
  klaytnRpcUrl: process.env.NEXT_PUBLIC_KLAYTN_RPC_URL,
  currency: 'KLAY',
} as const;
