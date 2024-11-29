import SwapInput from '../trade/swap/_components/SwapInput';
import AddTokens from '../trade/swap/_components/AddTokens';
import NavbarColorChanger from '../trade/swap/_components/NavbarColorChanger';
import DocsButton from '../trade/swap/_components/DocsButton';

export default function Swap() {
  return (
    <section className="px-4 bg-black-2">
      <NavbarColorChanger />
      <main className=" relative pb-[1020px] lg:pb-[1080px] w-full min-h-[100dvh]">
        <section className="pt-20 flex flex-col items-center mx-4relative z-10 absolute w-full">
          <h1 className="font-bold my-2">Swap</h1>
          <p className="p1 pb-2">
            You can swap between KRWO and Open Vouchers.
          </p>
          <DocsButton />
          <SwapInput />
          <AddTokens />
        </section>
      </main>
      <div className="absolute w-full left-1/2 -translate-x-1/2 bottom-0">
        <div className="max-w-[480px] lg:max-w-[100vw] m-[0_auto] relative">
          <div className="bg-glass h-[calc(100dvh-160px)]" />
        </div>
        <div className="bg-[linear-gradient(180deg,rgba(252,252,252,0.00)_0%,#FCFCFC_75.68%)] h-[200px] absolute w-full bottom-0" />
        <div className="hidden lg:block lg:bg-[linear-gradient(0deg,rgba(252,252,252,0.00)_0%,#FCFCFC_75.68%)] h-[500px] absolute w-full top-[0px]" />
      </div>
    </section>
  );
}
