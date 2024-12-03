import TradeCategory from './TradeCategory';

interface ContentBoxProps {
  children: React.ReactNode;
}

export default function ContentBox({ children }: ContentBoxProps) {
  return (
    <section className="relative w-full">
      <section className="pt-3 flex flex-col items-center z-10 w-full">
        <section className="shadow-customShadow p-4 w-full max-w-[480px] rounded-2xl bg-black-1 z-10">
          <TradeCategory />
          {children}
        </section>
      </section>
    </section>
  );
}
