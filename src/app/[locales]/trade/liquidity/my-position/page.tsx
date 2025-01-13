import MyPositions from './_components/MyPositions';
import { setRequestLocale } from 'next-intl/server';

export default async function LiquidityMyPosition({
  params: { locales },
}: {
  params: { locales: string };
}) {
  setRequestLocale(locales);
  return <MyPositions />;
}
