import { usePathname } from '@/src/i18n/routing';
import { useToolTip } from '@/src/lib/hook/useToolTip';
import Lottie from 'lottie-react';
import { useEffect } from 'react';
import bellLottie from '@/public/lottie/bell.json';
import ChevronRightIcon from '@/public/svg/chevron/right.svg';
import Link from 'next/link';
import { PROVIDE_LIQUIDITY_URL } from '@/src/lib/constants/url';

export default function LiquidityTooltip() {
  const pathname = usePathname();
  const selectedMethod = pathname.split('/')[2];
  const { openTooltip, Tooltip, closeTooltip } = useToolTip({
    closeOnClick: false,
  });

  useEffect(() => {
    if (selectedMethod === 'liquidity') openTooltip();
    else closeTooltip();
  }, [selectedMethod, openTooltip, closeTooltip]);
  return (
    <Tooltip
      className="bg-[rgba(0,0,0,0.5)] rounded-lg -translate-y-[120%] after:left-[50%] left-[10%] "
      tailPosition="bottom"
    >
      <Link
        className="px-2 py-[6px] flex flex-row gap-1 items-center"
        href={PROVIDE_LIQUIDITY_URL}
        target="_blank"
      >
        <Lottie animationData={bellLottie} loop={true} className="w-4 h-4" />
        <p className="text-black-1 c1">How to Provide Liquidity</p>
        <ChevronRightIcon className="w-4 h-4 stroke-black-1" />
      </Link>
    </Tooltip>
  );
}
