import CurrentPrice from '../recommend/_components/CurrentPrice';
import MyPositions from './_components/MyPositions';
import { fetchGetCurrentTick } from '@/src/lib/utils/api/liquidity/fetchGetCurrentTick';
import { usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { setRequestLocale } from 'next-intl/server';

export default async function LiquidityMyPosition({
  params: { locales },
}: {
  params: { locales: string };
}) {
  setRequestLocale(locales);

  const { currentTick } = await fetchGetCurrentTick({
    chainId: 8217,
    token: 'usdt',
  });

  return (
    <>
      <CurrentPrice currentPrice={Math.floor(+usdtTickToKrw(currentTick))} />
      <MyPositions />
    </>
  );
}
