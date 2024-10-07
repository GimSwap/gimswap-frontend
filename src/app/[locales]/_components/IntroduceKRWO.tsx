import Image from 'next/image';
import KRWOImage from '@/src/assets/image/KRWOIcon.webp';

export default function IntroduceKRWO() {
  return (
    <section className="py-[100px]">
      <h1 className="text-center font-bold mb-6">Introducing KRWO</h1>
      <section className="bg-purple-500 rounded-2xl py-6 px-[30px] relative max-h-fit flex flex-col justify-center items-center lg:flex-row lg:h-[280px] overflow-hidden lg:justify-start">
        <Image
          src={KRWOImage}
          alt="KRWO"
          className="opacity-40 mix-blend-overlay w-auto h-[260px] lg:left-0 lg:h-[320px] lg:-translate-x-[10%] lg:translate-y-[10%]"
        />
        <h5 className="font-medium text-black-1 text-center lg:text-left z-10 relative pt-[60px] -mt-[120px] pb-[18px] bg-[linear-gradient(180deg,rgba(146,108,255,0.00)_0%,#926CFF_14.5%)] max-w-[280px] lg:max-w-[460px] lg:pt-0 lg:mt-0 lg:pb-0">
          KRWO is a KRW-based stablecoin, designed to offer stability by
          eliminating exposure to foreign exchange volatility and GIMP. Every
          KRWO is fully backed by Fiat-backed Assets, ensuring it can be
          exchanged 1:1 for Korean Won.
        </h5>
      </section>
    </section>
  );
}
