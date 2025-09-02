"use client";

import SliderItem from "@/src/app/[locales]/_components/KeyVisualSlider/components/SliderItem";
import { CTA_ITEMS } from "@/src/app/[locales]/_components/KeyVisualSlider/types";

export default function DesktopSlider() {
  return (
    <div className="relative flex w-[380px] items-center justify-center gap-4">
      <div className="flex gap-4 overflow-hidden">
        <div className="flex">
          <SliderItem item={CTA_ITEMS[0]} type="desktop" />
        </div>
      </div>
    </div>
  );
}
