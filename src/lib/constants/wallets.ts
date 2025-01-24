import MetaMaskIcon from '@/public/svg/wallet/metamask.svg';
import KaiaWalletIcon from '@/public/svg/wallet/Kaia.svg';
import { checkIsMobileBrowser } from '@/src/lib/utils/checkIsMobileBrowser';
import { bsc, bscTestnet } from 'wagmi/chains';

export const CONNECTOR_NAMES = {
  metamask: 'metaMask',
  kaia: 'Kaia',
} as const;

const isMetamaskInstalled = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (checkIsMobileBrowser('metamask')) return true;
  else if (checkIsMobileBrowser('kaia')) return false;
  else return !!window?.ethereum?.isMetaMask;
};

export const isKaiaWalletInstalled = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (checkIsMobileBrowser('kaia')) return true;
  else return !!window.klaytn;
};

export interface WalletType {
  id: string;
  title: string;
  icon: React.ElementType;
  connectorId: string;
  get installed(): boolean;
  get isMobile(): boolean;
  get transport(): any;
  deepLink: string;
  unsupportedChainIds: number[];
}

export const WALLETS: WalletType[] = [
  {
    id: 'metaMask',
    title: 'MetaMask',
    icon: MetaMaskIcon,
    connectorId: CONNECTOR_NAMES.metamask,
    get installed() {
      return isMetamaskInstalled();
    },
    get isMobile() {
      return checkIsMobileBrowser('metamask');
    },
    get transport() {
      return window?.ethereum;
    },
    deepLink: 'https://metamask.app.link/dapp/',
    unsupportedChainIds: [],
  },
  {
    id: 'Kaia',
    title: 'Kaia',
    icon: KaiaWalletIcon,
    connectorId: CONNECTOR_NAMES.kaia,
    get installed() {
      return isKaiaWalletInstalled();
    },
    get isMobile() {
      return checkIsMobileBrowser('kaia');
    },
    get transport() {
      return this.isMobile ? window.ethereum : window.klaytn;
    },
    deepLink: 'https://app.kaiawallet.io/u/',
    unsupportedChainIds: [bsc.id, bscTestnet.id],
  },
];
