import { CONTRACT_ADDRESS } from './contractAddress';
import openVoucherIcon from '@/public/svg/token/open-voucher.svg';
import KRWOIcon from '@/public/svg/token/KRWO.svg';
import USDTIcon from '@/public/svg/token/USDT.svg';
import KaiaIcon from '@/public/svg/token/Kaia.svg';
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

export const KRWO = {
  name: 'KRWO',
  unit: 1,
  contractAddress: CONTRACT_ADDRESS.KRWO,
  icon: KRWOIcon,
  imageUrl: 'https://www.gimswap.com/svg/token/KRWO.svg',
  symbol: 'KRWO',
  method: 'transferAndCall',
  decimal: 6,
  color: '#BFF009',
} as const;

export const KLAYTN = {
  chainId: 0x2019,
  chainName: 'Kaia',
  blockExplorerUrl: process.env.NEXT_PUBLIC_KLAYTN_BLOCK_EXPLORER_URLS,
  klaytnRpcUrl: process.env.NEXT_PUBLIC_KLAYTN_RPC_URL,
  currency: 'KLAY',
  symbol: 'KAIA',
  icon: KaiaIcon,
  color: '#595959',
  decimal: 18,
} as const;

export const USDT = {
  name: 'USDT',
  unit: 1,
  contractAddress: '0x5C13E303a62Fc5DEdf5B52D66873f2E59fEdADC2',
  icon: USDTIcon,
  imageUrl: 'https://www.gimswap.com/svg/token/USDT.svg',
  symbol: 'USDT',
  method: 'transferAndCall',
  decimal: 6,
  color: '#50AF95',
} as const;

export const MAX_ALLOWANCE =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const POSITION_TOKEN_DECIMAL = 6;
