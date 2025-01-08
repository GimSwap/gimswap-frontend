import { fetchGetMyPositions } from '@/src/lib/utils/api/liquidity/fetchGetMyPositions';
import ContentBox from '../_components/ContentBox';
import DexLink from './recommend/_components/DexLink';
import LiquidityCategory from './recommend/_components/LiquidityCategory';
import { getWalletInfo } from '@/src/lib/utils/wallets/getWallet';

export default async function LiquidityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const walletAddress = (await getWalletInfo())?.accounts[0];
  const liquidities = walletAddress
    ? await fetchGetMyPositions(8217, walletAddress)
    : {
        positions: [],
      };

  return (
    <>
      <ContentBox>
        <LiquidityCategory myPositionAmount={liquidities.positions.length} />
        {children}
      </ContentBox>
      <DexLink />
    </>
  );
}
