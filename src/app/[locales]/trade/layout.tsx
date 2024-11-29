import BackgroundGlasses from './_components/BackgroundGlasses';
import BalanceCard from './_components/BalanceCard';
import NavbarColorChanger from './swap/_components/NavbarColorChanger';

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarColorChanger />
      <section className="px-4 bg-black-2 pt-[calc(72px+16px)]">
        <BalanceCard />
        {children}
        <BackgroundGlasses />
      </section>
    </>
  );
}
