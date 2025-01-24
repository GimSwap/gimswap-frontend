import BackgroundGlasses from './_components/BackgroundGlasses';
import BalanceCard from './_components/balanceCard/BalanceCard';
import InnerPopups from './_components/InnerPopups';
import NavbarColorChanger from './swap/_components/NavbarColorChanger';

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarColorChanger />
      <div className="pb-[360px] bg-black-2 relative pt-[88px] px-4">
        <div className="flex flex-row justify-center gap-4">
          <div className="flex flex-col w-full max-w-[480px] transition-all z-40 relative">
            <div>
              <BalanceCard />
            </div>
            {children}
          </div>
          <InnerPopups />
        </div>
        <BackgroundGlasses />
      </div>
    </>
  );
}
