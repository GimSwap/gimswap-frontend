'use client';

import { Link } from '@/src/navigation';
import { usePathname } from '@/src/navigation';
const CATEGORIES = ['Swap', 'Buy', 'Liquidity'];

export default function TradeCategory() {
  const pathname = usePathname();
  const selectedMethod = pathname.split('/')[2];
  return (
    <section className="flex gap-4">
      {CATEGORIES.map((category) => {
        const isSelected = selectedMethod === category.toLowerCase();
        return (
          <Link key={category} href={`/trade/${category.toLowerCase()}`}>
            <h3
              className={`${isSelected ? 'text-black-12' : 'text-black-6'} font-bold`}
            >
              {category}
            </h3>
          </Link>
        );
      })}
    </section>
  );
}
