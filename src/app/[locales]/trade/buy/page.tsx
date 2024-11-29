import TradeCategory from '../_components/TradeCategory';
import BuyInput from './_components/BuyInput';
import DocsButton from '../swap/_components/DocsButton';

export default function Buy() {
  return (
    <main className="relative pb-[1020px] lg:pb-[1080px] w-full min-h-[100dvh]">
      <section className="pt-3 flex flex-col items-center z-10 absolute w-full">
        <section className="shadow-customShadow p-4 w-full max-w-[480px] rounded-2xl bg-black-1 z-10">
          <TradeCategory />
          <DocsButton />
          <BuyInput />
        </section>
      </section>
    </main>
  );
}
