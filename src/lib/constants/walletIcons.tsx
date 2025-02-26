import MetamaskIcon from '@/public/svg/wallet/metamask.svg';
import KaiaWalletIcon from '@/public/svg/wallet/Kaia.svg';
import BinanceWalletIcon from '@/public/svg/wallet/binance.svg';

export const WALLET_ICONS: Record<string, React.ElementType> = {
  MetaMask: MetamaskIcon,
  Kaia: KaiaWalletIcon,
  'Binance Wallet': BinanceWalletIcon,
};

export const WALLET_ICONS_URL: Record<string, string> = {
  MetaMask: `${process.env.NEXT_PUBLIC_IMAGE_URL}/wallet/metamask.svg`,
  Kaia: `${process.env.NEXT_PUBLIC_IMAGE_URL}/wallet/Kaia.svg`,
  'Binance Wallet': `${process.env.NEXT_PUBLIC_IMAGE_URL}/wallet/binance.svg`,
};
