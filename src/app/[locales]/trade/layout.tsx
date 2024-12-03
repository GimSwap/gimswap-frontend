import BackgroundGlasses from './_components/BackgroundGlasses';
import BalanceCard from './_components/BalanceCard';
import NavbarColorChanger from './swap/_components/NavbarColorChanger';

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-[360px] bg-black-2 relative pt-[88px] px-4">
      <NavbarColorChanger />
      <BalanceCard />
      {children}
      <BackgroundGlasses />
    </div>
  );
}
