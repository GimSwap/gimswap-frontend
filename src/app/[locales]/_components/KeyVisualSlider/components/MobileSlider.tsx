import { CTA_ITEMS } from "../types";
import SliderItem from "./SliderItem";

export default function MobileSlider() {
  return (
    <div
      className="relative mx-auto w-full max-w-full overflow-hidden"
      role="region"
    >
      <div className="flex w-full items-center justify-center gap-4 pt-4">
        <div
          className="relative flex w-full justify-center overflow-visible"
          aria-live="polite"
        >
          <div style={{ minHeight: "150px" }}>
            <div className='"translate-y-[16px] scale-100 transform transition-all duration-500 z-10 opacity-100 mx-auto"'>
              <SliderItem item={CTA_ITEMS[0]} type="mobile" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
