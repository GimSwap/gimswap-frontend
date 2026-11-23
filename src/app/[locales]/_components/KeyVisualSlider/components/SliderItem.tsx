import Button from "@/src/components/Button";
import { memo } from "react";
import { CTAItem } from "../types";

const SLIDER_ITEM_WIDTH = {
  mobile: 240,
  desktop: 300,
};

interface SliderItemProps {
  item: CTAItem;
  type: "mobile" | "desktop";
}

// "translate-y-[16px] scale-100 transform transition-all duration-500 z-10 opacity-100 mx-auto",
const SliderItem = memo(({ item, type }: SliderItemProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-[#FFFFFF1A] bg-[#FFFFFF1A] p-4 backdrop-blur-[10px]"
      style={{
        width: `${SLIDER_ITEM_WIDTH[type]}px`,
        maxWidth: "100%",
      }}
    >
      <p className="c1 user-select-none text-[12px] font-normal text-black-1">
        {item.description}
      </p>
      <Button href={item.href} color="primary" size="md">
        {item.buttonText}
      </Button>
    </div>
  );
});

export default SliderItem;
