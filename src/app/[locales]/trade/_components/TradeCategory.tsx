'use client';

import { useToolTip } from '@/src/lib/hook/useToolTip';
import { Link } from '@/src/navigation';
import { usePathname } from '@/src/navigation';
import { useEffect } from 'react';
import bellLottie from '@/public/lottie/bell.json';
import Lottie from 'lottie-react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { fetchGetBalance } from '@/src/lib/utils/api/fetchGetBalance';

const CATEGORIES = ['Swap', 'Buy', 'Liquidity'];

export default function TradeCategory() {
  const pathname = usePathname();
  const { address } = useAccount();

  const selectedMethod = pathname.split('/')[2];
  const { data } = useQuery({
    queryKey: ['getBalance'],
    queryFn: () => fetchGetBalance({ walletAddress: address! }),
    enabled: !!address,
    select: (data) => data.balance,
  });

  const { openTooltip, Tooltip, closeTooltip } = useToolTip<typeof data>({
    closeOnClick: pathname === '/trade/buy',
    dependency: data,
  });

  useEffect(() => {
    if (
      (selectedMethod === 'swap' && data?.ov === 0) ||
      selectedMethod === 'buy'
    ) {
      openTooltip();
    } else {
      closeTooltip();
    }
  }, [selectedMethod, data, openTooltip, closeTooltip]);

  return (
    <section className="flex gap-3">
      <Tooltip
        className="bg-[rgba(0,0,0,0.5)] rounded-lg -translate-y-[120%] after:left-[40%] "
        tailPosition="bottom"
      >
        <div className="px-2 py-[6px] flex flex-row gap-1">
          <Lottie animationData={bellLottie} loop={true} className="w-4 h-4" />
          <p className="text-black-1 c1">Buy Open Voucher Now!</p>
        </div>
      </Tooltip>
      {CATEGORIES.map((category) => {
        const isSelected = selectedMethod === category.toLowerCase();
        return (
          <Link
            key={category}
            href={`/trade/${category.toLowerCase()}`}
            className={`flex flex-col pb-2 ${
              isSelected ? 'border-b-2 border-black-12' : ''
            }`}
          >
            <h5
              className={`${isSelected ? 'text-black-12' : 'text-black-6'} font-bold`}
            >
              {category}
            </h5>
          </Link>
        );
      })}
    </section>
  );
}
