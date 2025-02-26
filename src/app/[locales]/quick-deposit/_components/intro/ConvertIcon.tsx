'use client';

import Lottie from 'lottie-react';
import ConvertLottie from '@/public/lottie/convert.json';

export default function ConvertIcon() {
  return (
    <div className="flex justify-center py-3">
      <Lottie
        animationData={ConvertLottie}
        loop
        className="w-[200px] h-[200px]"
      />
    </div>
  );
}
