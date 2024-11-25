import SwapInput from './_components/SwapInput';
import AddTokens from './_components/AddTokens';
import DocsButton from './_components/DocsButton';
import TradeCategory from '../_components/TradeCategory';

export default function Swap() {
  return (
    <main className=" relative pb-[1020px] lg:pb-[1080px] w-full min-h-[100dvh]">
      <section className="pt-20 flex flex-col items-center z-10 absolute w-full">
        <section className="shadow-customShadow p-6 w-full max-w-[480px] rounded-2xl bg-black-1 z-10">
          <TradeCategory />
          <DocsButton />
          <SwapInput />
        </section>
        <AddTokens />
      </section>
    </main>
  );
}
