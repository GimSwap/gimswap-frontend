'use client';

import { Link, usePathname } from '@/src/i18n/routing';
import { TRADE_CATEGORIES } from '@/src/lib/constants/category/TradeCategory';
import BuyTooltip from './tooltips/BuyTooltip';
import LiquidityTooltip from './tooltips/LiquidityTooltip';

export default function TradeCategory() {
  const pathname = usePathname();
  const selectedMethod = pathname.split('/')[2];

  return (
    <section className="flex gap-3 relative">
      <BuyTooltip />
      <LiquidityTooltip />
      {TRADE_CATEGORIES.map(({ title, key, url }) => {
        const isSelected = selectedMethod === key;
        return (
          <div className="flex flex-row gap-[2px]" key={key}>
            <Link
              href={url}
              className={`flex flex-col pb-2 ${
                isSelected ? 'border-b-2 border-black-12' : ''
              }`}
            >
              <h5
                className={`${isSelected ? 'text-black-12' : 'text-black-6'} font-bold`}
              >
                {title}
              </h5>
            </Link>
            {key === 'liquidity' && (
              <p className="font-pretendard text-[8px] bg-[#FDEDED] px-[6px] py-[3px] rounded-full text-error h-[fit-content] mt-1 font-medium">
                NEW
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
