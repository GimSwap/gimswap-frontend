import MetaMaskIcon from '@/public/svg/wallet/metamask.svg';
import KaiaWalletIcon from '@/public/svg/wallet/Kaia.svg';
import { checkIsMobileBrowser } from '@/src/lib/utils/checkIsMobileBrowser';

export const CONNECTOR_NAMES = {
  metamask: 'metaMask',
  kaia: 'Kaia',
} as const;

const isMetamaskInstalled = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.ethereum?.isMetaMask ? true : false;
};

const isKaiaWalletInstalled = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.klaytn ? true : false;
};

export const WALLETS = [
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
      return window.ethereum;
    },
    deepLink: 'https://metamask.app.link/dapp',
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
    deepLink: 'https://app.kaiawallet.io/u',
  },
];
