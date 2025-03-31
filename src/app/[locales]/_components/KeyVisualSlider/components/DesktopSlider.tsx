'use client';

import SliderItem from '@/src/app/[locales]/_components/KeyVisualSlider/components/SliderItem';
import { CTA_ITEMS } from '@/src/app/[locales]/_components/KeyVisualSlider/types';
import ChevronLeftIcon from '@/public/svg/chevron-left.svg';
import ChevronRightIcon from '@/public/svg/chevron-right.svg';
import { useDesktopSlider } from '@/src/app/[locales]/_components/KeyVisualSlider/hooks';

export default function DesktopSlider() {
  const { goToPrev, goToNext, sliderRef, getSliderStyles } = useDesktopSlider({
    loop: false,
  });

  return (
    <div className="relative flex w-[380px] items-center justify-center gap-4">
      <button
        className="h-8 flex w-8 items-center justify-center rounded-full focus:outline-none"
        onClick={goToPrev}
      >
        <ChevronLeftIcon className="h-6 hover:text-white w-6 cursor-pointer text-black-6 transition-colors lg:block" />
      </button>

      <div className="flex gap-4 overflow-hidden">
        <div ref={sliderRef} className="flex" style={getSliderStyles()}>
          {CTA_ITEMS.map((item, index) => (
            <div key={index} className="w-full">
              <SliderItem item={item} type="desktop" />
            </div>
          ))}
        </div>
      </div>

      <button
        className="h-8 flex w-8 items-center justify-center rounded-full focus:outline-none"
        onClick={goToNext}
      >
        <ChevronRightIcon className="h-6 hover:text-white w-6 cursor-pointer text-black-6 transition-colors lg:block" />
      </button>
    </div>
  );
}
