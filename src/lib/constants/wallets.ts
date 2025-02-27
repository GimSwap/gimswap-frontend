import MetaMaskIcon from '@/public/svg/wallet/metamask.svg';
import KaiaWalletIcon from '@/public/svg/wallet/Kaia.svg';
import BinanceWalletIcon from '@/public/svg/wallet/binance.svg';
import { checkIsMobileBrowser } from '@/src/lib/utils/checkIsMobileBrowser';
import { bsc, bscTestnet, kaia, kairos } from 'wagmi/chains';
import { isInBinance } from '@binance/w3w-utils';
import { wagmiConfig } from '../utils/wagmi';

export const CONNECTOR_NAMES = {
  metamask: ['metaMask', 'metaMaskSDK'],
  kaia: ['Kaia'],
  binance: ['wallet.binance.com', 'BinanceW3WSDK'],
};

const createQrCode = async () => {
  const walletConnectConnector = wagmiConfig.connectors.find(
    (connector) => connector.id === 'walletConnect',
  );
  if (!walletConnectConnector) return Promise.resolve('');

  const provider = await walletConnectConnector.getProvider();

  if (!provider) return Promise.resolve('');

  return new Promise<string>((resolve) => {
    // @ts-ignore
    provider.on('display_uri', (uri: string) => {
      resolve(uri);
    });
  });
};

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
  connectorId: string[];
  get installed(): boolean;
  get isMobile(): boolean;
  get transport(): any;
  deepLink?: string;
  unsupportedChainIds: number[];
  supportAddToken: boolean;
  supportInAppBrowser: boolean;
  useWalletConnect?: boolean;
  qrCode?: Promise<string>;
}

export const WALLETS: WalletType[] = [
  {
    id: 'metaMaskSDK',
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
    unsupportedChainIds: isInBinance() ? [bsc.id] : [],
    supportAddToken: true,
    supportInAppBrowser: true,
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
    supportAddToken: true,
    supportInAppBrowser: true,
  },
  {
    id: 'Binance Wallet',
    title: 'Binance Wallet',
    icon: BinanceWalletIcon,
    connectorId: CONNECTOR_NAMES.binance,
    get installed() {
      return window?.ethereum?.isBinance;
    },
    get isMobile() {
      return window?.ethereum?.isBinance;
    },
    get transport() {
      return window?.ethereum;
    },
    deepLink: 'bnc://app.binance.com/cedefi/wc',
    unsupportedChainIds: [kaia.id, kairos.id],
    supportAddToken: false,
    supportInAppBrowser: false,
    useWalletConnect: true,
    get qrCode() {
      return createQrCode();
    },
  },
];
