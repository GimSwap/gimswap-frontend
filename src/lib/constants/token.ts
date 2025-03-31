import openVoucherIcon from '@/public/svg/token/open-voucher-resizable.svg';
import KRWOIcon from '@/public/svg/token/KRWO.svg';
import KRWOIconBsc from '@/public/svg/token/KRWO-bsc.svg';
import USDTIcon from '@/public/svg/token/USDT.svg';
import KaiaIcon from '@/public/svg/token/Kaia.svg';
import BNBIcon from '@/public/svg/token/bnb.svg';
import KaiaScannerIcon from '@/public/svg/scanner/kaia-scanner.svg';
import BscScannerIcon from '@/public/svg/scanner/bsc-scanner.svg';
import { kaia, bsc } from 'wagmi/chains';
import { createToken } from '../utils/factory/token';

export const EXCHANGE_RATE_DECIMAL_OV_TO_KRWO = 4;
export const SWAP_DECIMAL_OV_TO_KRWO = 6;

export const CONTRACT_ADDRESS_MAP = {
  OV: {
    [kaia.id]: process.env.NEXT_PUBLIC_OPEN_VOUCHER_CONTRACT_ADDRESS_KAIA!,
    [bsc.id]: process.env.NEXT_PUBLIC_OPEN_VOUCHER_CONTRACT_ADDRESS_BSC!,
  },
  KRWO: {
    [kaia.id]: process.env.NEXT_PUBLIC_KRWO_CONTRACT_ADDRESS_KAIA!,
    [bsc.id]: process.env.NEXT_PUBLIC_KRWO_CONTRACT_ADDRESS_BSC!,
  },
  USDT: {
    [kaia.id]: process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS_KAIA!,
    [bsc.id]: process.env.NEXT_PUBLIC_USDT_CONTRACT_ADDRESS_BSC!,
  },
  GIMSWAP: {
    [kaia.id]: process.env.NEXT_PUBLIC_GIM_SWAP_CONTRACT_ADDRESS_KAIA!,
    [bsc.id]: process.env.NEXT_PUBLIC_GIM_SWAP_CONTRACT_ADDRESS_BSC!,
  },
  GIMSWAP_SWIFT_TRANSFER: {
    [bsc.id]:
      process.env.NEXT_PUBLIC_GIMSWAP_SWIFT_TRANSFER_CONTRACT_ADDRESS_BSC!,
  },
  GIMSWAP_SWAP_AGENT: {
    [bsc.id]: process.env.NEXT_PUBLIC_GIMSWAP_SWAP_AGENT_CONTRACT_ADDRESS_BSC!,
    [kaia.id]:
      process.env.NEXT_PUBLIC_GIMSWAP_SWAP_AGENT_CONTRACT_ADDRESS_KAIA!,
  },
};

export const OPEN_VOUCHER = createToken({
  name: 'Open Voucher',
  unit: 10000,
  contractAddress: {
    [kaia.id]: CONTRACT_ADDRESS_MAP['OV'][kaia.id],
    [bsc.id]: CONTRACT_ADDRESS_MAP['OV'][bsc.id],
  },
  icon: openVoucherIcon,
  imageUrl: 'https://www.gimswap.com/svg/token/open-voucher.svg',
  symbol: 'OV',
  method: 'transferVoucherAndCall',
  decimal: 10,
  color: '#000000',
  multiProfile: false,
  multiDecimal: false,
});

export const KRWO = createToken({
  name: 'KRWO',
  unit: 1,
  contractAddress: {
    [kaia.id]: CONTRACT_ADDRESS_MAP['KRWO'][kaia.id],
    [bsc.id]: CONTRACT_ADDRESS_MAP['KRWO'][bsc.id],
  },
  icon: {
    [kaia.id]: KRWOIcon,
    [bsc.id]: KRWOIconBsc,
  },
  imageUrl: {
    [kaia.id]: 'https://www.gimswap.com/svg/token/KRWO.svg',
    [bsc.id]: 'https://www.gimswap.com/svg/token/KRWO-bsc.svg',
  },
  symbol: 'KRWO',
  method: 'transferAndCall',
  decimal: 6,
  color: {
    [kaia.id]: '#BFF009',
    [bsc.id]: '#F3BA2F',
  },
  multiProfile: true,
  multiDecimal: false,
});

export const USDT = createToken({
  name: 'USDT',
  unit: 1,
  icon: USDTIcon,
  contractAddress: {
    [kaia.id]: CONTRACT_ADDRESS_MAP['USDT'][kaia.id],
    [bsc.id]: CONTRACT_ADDRESS_MAP['USDT'][bsc.id],
  },
  imageUrl: 'https://www.gimswap.com/svg/token/USDT.svg',
  symbol: 'USDT',
  method: 'transferAndCall',
  decimal: {
    [kaia.id]: 6,
    [bsc.id]: 18,
  },
  color: '#50AF95',
  multiProfile: false,
  multiDecimal: true,
});

export const KLAYTN = {
  chainId: 0x2019,
  chainName: 'Kaia',
  blockExplorerUrl: process.env.NEXT_PUBLIC_KLAYTN_BLOCK_EXPLORER_URLS,
  klaytnRpcUrl: process.env.NEXT_PUBLIC_KLAYTN_RPC_URL,
  currency: 'KLAY',
  symbol: 'KAIA',
  icon: KaiaIcon,
  color: '#141414',
  decimal: 18,
  supportFarming: true,
  fee: 0.2,
} as const;

export const BSC = {
  name: 'BNB',
  icon: BNBIcon,
  imageUrl: 'https://www.gimswap.com/svg/token/BNB.svg',
  symbol: 'BNB',
  method: 'transferAndCall',
  decimal: 18,
  color: '#141414',
  supportFarming: false,
  fee: 0.05,
  precision: 5,
} as const;

// TODO after adding cake token
export const CAKE = {
  ...BSC,
  name: 'Cake',
};

export const RKAIA = {
  ...KLAYTN,
  symbol: 'RKAIA',
  color: '#8C8C8C',
};

export const MAX_ALLOWANCE =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const POSITION_TOKEN_DECIMAL = 6;

export const CHAIN_ICONS: Record<number, React.ElementType> = {
  [kaia.id]: KLAYTN.icon,
  [bsc.id]: BSC.icon,
};

export const SCANNER_MAP = {
  [kaia.id]: {
    icon: KaiaScannerIcon,
    link: process.env.NEXT_PUBLIC_SCANNER_URL_KAIA!,
  },
  [bsc.id]: {
    icon: BscScannerIcon,
    link: process.env.NEXT_PUBLIC_SCANNER_URL_BSC!,
  },
};

export const TOKEN_MAP = {
  [kaia.id]: {
    krwo: KRWO,
    ov: OPEN_VOUCHER,
    native: KLAYTN,
    reward: RKAIA,
  },
  [bsc.id]: {
    krwo: KRWO,
    ov: OPEN_VOUCHER,
    native: BSC,
    reward: CAKE,
  },
};

export const CHAIN_NAME_MAP: Record<number, string> = {
  [kaia.id]: 'Kaia',
  [bsc.id]: 'BNB Chain',
};

export const defaultChain = kaia;

interface TokenPairOrderMap {
  [chainId: number]: {
    [token: string]: {
      base: string;
      quote: string;
    };
  };
}

export const TOKEN_PAIR_ORDER_MAP: TokenPairOrderMap = {
  [kaia.id]: {
    USDT: {
      base: 'kaia',
      quote: 'krwo',
    },
    KRWO: {
      base: 'kaia',
      quote: 'krwo',
    },
    KAIA: {
      base: 'kaia',
      quote: 'krwo',
    },
  },
  [bsc.id]: {
    USDT: {
      base: 'bnb',
      quote: 'krwo',
    },
    KRWO: {
      base: 'bnb',
      quote: 'krwo',
    },
    BNB: {
      base: 'krwo',
      quote: 'bnb',
    },
  },
};
