import MetamaskIcon from '@/public/svg/wallet/metamask.svg';
import KaiaWalletIcon from '@/public/svg/wallet/Kaia.svg';
import BinanceWalletIcon from '@/public/svg/wallet/binance.svg';

export const WALLET_ICONS: Record<string, React.ElementType> = {
  MetaMask: MetamaskIcon,
  Kaia: KaiaWalletIcon,
  'Binance Wallet': BinanceWalletIcon,
};
