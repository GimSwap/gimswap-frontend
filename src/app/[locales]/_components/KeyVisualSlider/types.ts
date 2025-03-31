export type CTAItem = {
  title: string;
  description: string;
  buttonText: string;
  href: string;
};

export const CTA_ITEMS: CTAItem[] = [
  {
    title: 'KRW Stable Coin, KRWO',
    description: 'KRW Stable Coin, KRWO',
    buttonText: 'Get KRWO',
    href: '/trade/get-krwo',
  },
  {
    title: 'Send USDT to Binance',
    description: 'Send USDT to Binance',
    buttonText: 'Quick Deposit',
    href: '/quick-deposit',
  },
  {
    title: 'Token ↔ KRWO exchange',
    description: 'Token ↔ KRWO exchange',
    buttonText: 'Swap',
    href: '/trade/swap',
  },
  {
    title: 'USDT - KRWO LP',
    description: 'USDT - KRWO LP',
    buttonText: 'Liquidity',
    href: '/trade/liquidity/recommend',
  },
];

export const baseClassMap: Record<Position, string> = {
  current:
    'translate-y-[16px] scale-100 transform transition-all duration-500 z-10 opacity-100',
  prev: 'translate-y-[-16px] scale-90 transform opacity-50 transition-all duration-500 z-0',
  next: 'translate-y-[-16px] scale-90 transform opacity-50 transition-all duration-500 z-0',
  prevPrev:
    'translate-y-[-16px] scale-90 transform opacity-0 transition-all duration-500 z-0 absolute left-0',
  nextNext:
    'translate-y-[-16px] scale-90 transform opacity-0 transition-all duration-500 z-0 absolute right-0',
};

export const animationClassMap: Record<
  'left' | 'right',
  Partial<Record<Position, string>>
> = {
  left: {
    current: 'animate-slide-left-center',
    next: 'animate-slide-left-side',
    nextNext: 'animate-appear-from-right',
    prev: 'animate-disappear-to-left',
  },
  right: {
    current: 'animate-slide-right-center',
    prev: 'animate-slide-right-side',
    prevPrev: 'animate-appear-from-left',
    next: 'animate-disappear-to-right',
  },
};

export const positionMap: Record<number, Position> = {
  0: 'prevPrev',
  1: 'prev',
  2: 'current',
  3: 'next',
  4: 'nextNext',
};

export type Position = 'prevPrev' | 'prev' | 'current' | 'next' | 'nextNext';
