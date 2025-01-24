import DGSwapIcon from '@/src/assets/icons/dg-swap.png';
import CapybaraIcon from '@/src/assets/icons/capybara.png';
import KlaySwapIcon from '@/src/assets/icons/klay-swap.png';
import PancakeIcon from '@/src/assets/icons/pancake.png';
import { kaia, bsc } from 'wagmi/chains';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { StaticImageData } from 'next/image';

export type DEX_PROVIDER = string;
export const pancake: DEX_PROVIDER = "panacake"
export const dgswap: DEX_PROVIDER = "dgswap"

export const DEX_LIST: {
  name: string;
  icon: StaticImageData;
  href: string;
  subtitle: string;
  chainId: ChainIdType[];
}[] = [
  {
    name: 'Pancake',
    icon: PancakeIcon,
    href: 'https://pancakeswap.finance/liquidity/pools',
    subtitle: 'pancakeswap.finance',
    chainId: [bsc.id],
  },
  {
    name: 'Dragon Swap',
    icon: DGSwapIcon,
    href: 'https://dgswap.io/liquidity',
    subtitle: 'dgswap.io',
    chainId: [kaia.id],
  },
  {
    name: 'Klay Swap',
    icon: KlaySwapIcon,
    href: 'https://klayswap.com/ko/pool/v3',
    subtitle: 'klayswap.com',
    chainId: [kaia.id],
  },
  {
    name: 'Capybara',
    icon: CapybaraIcon,
    href: 'https://dex.capybara.exchange/en/pool',
    subtitle: 'capybara.exchange',
    chainId: [kaia.id],
  },
];

export const DEX_ICON_MAP = {
  [kaia.id]: DGSwapIcon,
  [bsc.id]: PancakeIcon,
};
