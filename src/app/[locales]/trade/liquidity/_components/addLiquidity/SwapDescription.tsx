import Lottie from 'lottie-react';
import StarIcon from '@/public/svg/star16.svg';
import AutoSwapLottie from '@/public/lottie/autoSwap.json';

export const SwapModeDescription = {
  normal: {
    backgroundColor: 'bg-black-4',
    chevronColor: 'stroke-black-8',
    title: (
      <div className="flex items-center gap-1 c1 !font-regular text-black-8">
        <StarIcon />
        <span className="font-bold whitespace-nowrap">Normal Mode:</span> Amount
        is adjusted by ratio.
      </div>
    ),
    description: (
      <p className="c1 text-black-8 px-4">
        Enter the first token amount, and the second token amount will be
        calculated by token ratio. <br />
        <span className="underline underline-offset-[2.5px]">
          Check Auto Swap Mode below to input freely.
        </span>
      </p>
    ),
  },
  auto: {
    backgroundColor: 'bg-purple-50',
    chevronColor: 'stroke-purple-500',
    title: (
      <div className="flex gap-1 c1 !font-regular text-purple-500 whitespace-nowrap">
        <Lottie animationData={AutoSwapLottie} loop className="w-4 h-4" />
        <span className="font-bold whitespace-nowrap">Auto Swap Mode:</span>
        Swap & Add occur together.
      </div>
    ),
    description: (
      <p className="c1 text-purple-500 px-4">
        Enter any amount, and the system will swap to provide proportional
        liquidity. <br />
        <span className="underline underline-offset-[2.5px]">
          Uncheck below to disable Auto Swap.
        </span>
      </p>
    ),
  },
};
