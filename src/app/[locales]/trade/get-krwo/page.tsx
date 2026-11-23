import SwapInput from './_components/SwapInput';
import { setRequestLocale } from 'next-intl/server';

export default function Swap({
  params: { locales },
}: {
  params: { locales: string };
}) {
  setRequestLocale(locales);

  return <SwapInput />;
}
