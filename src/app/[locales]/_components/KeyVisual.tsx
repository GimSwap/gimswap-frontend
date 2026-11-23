"use client";

import { useIntersectionObserver } from "@/src/lib/hook/useIntersectionObserver";
import { useTopbarStore } from "@/src/lib/stores/topbarStore/TopbarStoreProvider";
import KeyVisualImage from "@/src/assets/image/KeyVisual.webp";
import Image from "next/image";
import KeyVisualSlider from "@/src/app/[locales]/_components/KeyVisualSlider";

export default function KeyVisual() {
  const { setTarget } = useIntersectionObserver({
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.8,
    onEnter: () => setInvert(false),
    onLeave: () => setInvert(true),
  });
  const { setInvert } = useTopbarStore((state) => state);

  return (
    <section
      className="h-fit relative flex w-full flex-col items-center overflow-hidden bg-[linear-gradient(#000_69%,#33294D_100%)] pt-24 lg:h-[640px] lg:flex-row lg:gap-28"
      ref={setTarget}
    >
      <div className="lg:w-[50vw]">
        <Image
          src={KeyVisualImage}
          alt="key-visual"
          className="h-[auto] w-[345px] max-w-[750px] -translate-y-6 lg:ml-[91px] lg:h-[90%] lg:w-[auto] lg:max-w-[38vw] lg:translate-x-20 lg:translate-y-0"
          priority
          unoptimized
        />
      </div>
      <div className="bottom-[60px] flex w-full -translate-y-[30px] flex-col items-center justify-center gap-1 lg:w-[380px]">
        <p className="p1 text-center text-[16px] font-normal leading-[20px] text-black-6">
          KRWO-based platform
        </p>
        <h1 className="h1 mb-4 text-center text-[24px] font-bold text-black-1 sm:whitespace-nowrap">
          Stable Tokens{" "}
          <span className="block sm:inline">from Stable Assets</span>
        </h1>
        <KeyVisualSlider />
      </div>
    </section>
  );
}
