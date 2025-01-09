'use client';

import { LIQUIDTY_CATEGORY } from '@/src/lib/constants/category/LiquidityCategory';
import { Link, usePathname } from '@/src/i18n/routing';

interface LiquidityCategoryProps {
  myPositionAmount: number;
}

export default function LiquidityCategory({
  myPositionAmount,
}: LiquidityCategoryProps) {
  const pathname = usePathname();

  const amount = {
    recommend: 4,
    'my-position': myPositionAmount,
  };

  return (
    <nav className="my-4 p-1 flex flew-row gap-1 bg-black-3 rounded-lg">
      {LIQUIDTY_CATEGORY.map(({ title, key, url }) => {
        const isSelected = pathname.includes(url);
        return (
          <Link
            key={key}
            href={url}
            className={`c1 font-medium px-2 py-[10px] flex-1 text-center ${isSelected ? 'text-black-12 bg-black-1 shadow-customShadow' : 'text-black-6 bg-black-transparent'}`}
          >
            {`${title} ${amount[key]}`}
          </Link>
        );
      })}
    </nav>
  );
}
