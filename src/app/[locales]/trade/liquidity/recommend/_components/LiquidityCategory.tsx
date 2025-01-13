'use client';

import { LIQUIDTY_CATEGORY } from '@/src/lib/constants/category/LiquidityCategory';
import { Link, usePathname } from '@/src/i18n/routing';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { fetchGetMyPositions } from '@/src/lib/utils/api/liquidity/fetchGetMyPositions';
import { GetMyPositionsResponseType } from '@/src/lib/types/api/liquidity/GetPositionType';

export default function LiquidityCategory() {
  const { address } = useAccount();
  const pathname = usePathname();
  const { data: positions } = useQuery({
    queryKey: ['myPositions', address],
    queryFn: () => fetchGetMyPositions(8217, address!),
    select: (data: GetMyPositionsResponseType) => data.positions,
    enabled: !!address,
  });

  const amount = {
    recommend: 4,
    'my-position': positions?.length || 0,
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
