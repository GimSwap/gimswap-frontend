'use client';

import { useIntersectionObserver } from '@/src/lib/hook/useIntersectionObserver';
import Button from '@/src/components/Button';
import { useTopbarStore } from '@/src/lib/stores/topbarStore/TopbarStoreProvider';
import KeyVisualImage from '@/src/assets/image/KeyVisual.webp';
import Image from 'next/image';

export default function KeyVisual() {
  const { setTarget } = useIntersectionObserver({
    rootMargin: '0px 0px 0px 0px',
    threshold: 0.8,
    onEnter: () => setInvert(false),
    onLeave: () => setInvert(true),
  });
  const { setInvert } = useTopbarStore((state) => state);

  return (
    <section
      className="w-full bg-[linear-gradient(#000_69%,#33294D_100%)] flex items-center flex-col relative pt-24 overflow-hidden lg:flex-row lg:gap-28 h-fit lg:h-[640px]"
      ref={setTarget}
    >
      <section className="lg:w-[50vw]">
        <Image
          src={KeyVisualImage}
          alt="key-visual"
          className="w-[345px] h-[auto] lg:w-[auto] lg:h-[90%] lg:max-w-[38vw] lg:ml-[91px] max-w-[750px] -translate-y-6 lg:translate-y-0 lg:translate-x-20"
          priority
        />
      </section>
      <section className="bottom-[60px] flex flex-col -translate-y-[70px] items-center justify-center pb-10">
        <h1 className="text-black-1 text-center mb-2 font-bold max-w-[200px] lg:whitespace-nowrap lg:max-w-[1000px]">
          Real Tokens from Real Assets
        </h1>
        <p className="p1 text-black-1 text-center mb-6 max-w-[170px] lg:max-w-[300px]">
          The Platform for Tokenized Real-World Assets.
        </p>
        <Button
          title="Get Real Tokens"
          className="bg-purple-500 text-black-1"
          href="/swap"
        />
      </section>
    </section>
  );
}
