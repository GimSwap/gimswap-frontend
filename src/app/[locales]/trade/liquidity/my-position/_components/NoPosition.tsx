'use client';

import gimbab from '@/public/lottie/position/gimbab.json';
import Lottie from 'lottie-react';

export default function NoPosition() {
  return (
    <section className="p-4 flex flex-col gap-2">
      <Lottie
        animationData={gimbab}
        loop
        className="w-40 h-[160px] mt-[-15px] mb-[-25px] mx-auto"
      />
      <p className="text-p1 text-black-6 text-center">
        No liquidity provided.
        <br />
        Add recommended liquidity!
      </p>
    </section>
  );
}
