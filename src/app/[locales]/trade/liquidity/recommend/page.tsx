// import CoinsIcon from '@/public/svg/coins.svg';
// import { PROVIDE_LIQUIDITY_URL } from '@/src/lib/constants/url';
// import GradientButton from '@/src/components/GradientButton';
import RecommendPositions from './_components/recommend/RecommnedPositions';
import { setRequestLocale } from 'next-intl/server';

export default async function LiquidityRecommend({
  params: { locales },
}: {
  params: { locales: string };
}) {
  setRequestLocale(locales);

  return (
    <>
      {/* <GradientButton href={PROVIDE_LIQUIDITY_URL}>
        <CoinsIcon />
        <p className="p1 font-medium text-purple-500 ml-1 mr-2 rounded-[inherit] bg-purple-50 whitespace-nowrap">
          How to Provide Liquidity
        </p>
      </GradientButton> */}
      <RecommendPositions />
    </>
  );
}
