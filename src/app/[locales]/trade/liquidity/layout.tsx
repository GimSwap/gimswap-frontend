import ContentBox from '../_components/ContentBox';
import CurrentPrice from './recommend/_components/CurrentPrice';
import DexLink from './recommend/_components/DexLink';
import LiquidityCategory from './recommend/_components/LiquidityCategory';

export default async function LiquidityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ContentBox>
        <LiquidityCategory />
        <CurrentPrice />
        {children}
      </ContentBox>
      <DexLink />
    </>
  );
}
