import BackgroundGlasses from './_components/BackgroundGlasses';
import NavbarColorChanger from './swap/_components/NavbarColorChanger';

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 bg-black-2">
      <NavbarColorChanger />
      {children}
      <BackgroundGlasses />
    </section>
  );
}
