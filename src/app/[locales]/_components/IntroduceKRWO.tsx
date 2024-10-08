import Image from 'next/image';
import KRWOImage from '@/src/assets/image/KRWOIcon.webp';
import Link from 'next/link';

export default function IntroduceKRWO() {
  return (
    <section className="py-[100px]">
      <h1 className="text-center font-bold mb-6">Introducing KRWO</h1>
      <section className="bg-purple-500 rounded-2xl py-6 px-[30px] relative max-h-fit flex flex-col justify-center items-center lg:flex-row lg:py-[70px] overflow-hidden">
        <Image
          src={KRWOImage}
          alt="KRWO"
          className="opacity-40 mix-blend-overlay w-auto h-[260px] lg:absolute lg:left-0 lg:h-[320px] lg:-translate-x-[10%] lg:translate-y-[10%]"
        />
        <div className="flex flex-col justify-center items-center w-full">
          <h5 className="font-medium text-black-1 text-center z-10 relative pt-[60px] -mt-[120px] pb-[18px] bg-[linear-gradient(180deg,rgba(146,108,255,0.00)_0%,#926CFF_14.5%)] max-w-[280px] lg:max-w-[460px] lg:pt-0 lg:mt-0 lg:pb-0">
            KRWO is a KRW-based stablecoin, designed to offer stability by
            eliminating exposure to foreign exchange volatility and GIMP. Every
            KRWO is fully backed by Fiat-backed Assets, ensuring it can be
            exchanged 1:1 for Korean Won.
          </h5>
          <div className="flex flex-col lg:flex-row gap-4 pt-8 w-full items-center justify-center">
            <Link
              className="px-6 py-[14px] rounded-lg bg-black-1 lg:w-[240px] w-full text-center"
              href="https://docs.gimswap.com/gimswap-guide/what-is-krwo"
              target="_blank"
            >
              <h4 className="text-purple-500 font-bold">What is KRWO</h4>
            </Link>
            <Link
              className="px-6 py-[14px] rounded-lg bg-black-13 lg:w-[240px] w-full text-center"
              href="https://docs.gimswap.com/gimswap-guide/how-to-get-krwo"
              target="_blank"
            >
              <h4 className="text-black-1 font-bold">How to Get KRWO</h4>
            </Link>
          </div>
        </div>
      </section>
    </section>
  );
}
