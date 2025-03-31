import KrwoIcon from '@/public/svg/bitcoin-03.svg';
import SwapIcon from '@/public/svg/coins-swap.svg';
import LiquidityIcon from '@/public/svg/bitcoin-01.svg';
import DepositIcon from '@/public/svg/wallet-02.svg';
import DocsIcon from '@/public/svg/book-open-01.svg';

export const MENUS = [
  {
    title: 'Home',
    mobileTitle: 'Home',
    url: '/',
    externalLink: false,
  },
  {
    title: 'Get KRWO',
    mobileTitle: 'Get KRWO',
    url: '/trade/get-krwo',
    externalLink: false,
  },
  {
    title: 'Swap',
    mobileTitle: 'Swap',
    url: '/trade/swap',
    externalLink: false,
  },
  {
    title: 'Liquidity',
    mobileTitle: 'Liquidity',
    url: '/trade/liquidity',
    externalLink: false,
  },
  {
    title: 'Quick Deposit',
    mobileTitle: 'Deposit',
    url: '/quick-deposit',
    externalLink: false,
  },
  {
    title: 'Docs',
    mobileTitle: 'Docs',
    url: 'https://docs.gimswap.com/',
    externalLink: true,
  },
] as const;

export const MENU_ICONS = {
  'Get KRWO': KrwoIcon,
  Swap: SwapIcon,
  Liquidity: LiquidityIcon,
  'Quick Deposit': DepositIcon,
  Docs: DocsIcon,
} as const;

export type MenuType = (typeof MENUS)[number];
export type MenuTitleType = MenuType['title'];
export type MobileTitleType = MenuType['mobileTitle'];

export const MENU_WITH_ICONS = MENUS.filter(
  (menu) => menu.title !== 'Home',
).map((menu) => ({
  ...menu,
  icon: MENU_ICONS[menu.title],
}));
