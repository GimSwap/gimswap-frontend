import { formatNumber } from '@/src/lib/utils/formatNumber';
import { safeCalc } from '@/src/lib/utils/safeCalc';

interface RemoveSliderProps {
  value: string;
  setValue: (value: string) => void;
  totalAmount: string;
}

export default function RemoveSlider({
  value,
  setValue,
  totalAmount,
}: RemoveSliderProps) {
  const toPercentage = (
    numerator: string,
    denominator: number | string,
    percentage: number | string = 100,
  ) => {
    return formatNumber(
      safeCalc
        .multiply(
          safeCalc.divide(numerator, denominator).toString(),
          percentage,
        )
        .toString(),
      18,
    );
  };
  return (
    <section className="relative h-[4px] w-full mt-[10px] pb-[26px]">
      <div className="absolute top-0 left-0 h-[4px] bg-black-5 w-full" />
      <div
        className="absolute top-0 left-0 bg-purple-500 h-[4px]"
        style={{ width: `${toPercentage(value, totalAmount)}%` }}
      />
      <input
        type="range"
        className="custom-slider"
        value={toPercentage(value, totalAmount)}
        step={1}
        min={0}
        max={100}
        onChange={(e) => {
          setValue(toPercentage(e.target.value, 100, totalAmount));
        }}
      />
      <p
        className="c0 absolute top-[16px] text-purple-500 font-bold"
        style={{
          left: `calc(${toPercentage(value, totalAmount)}%)`,
          transform: `translateX(-${toPercentage(value, safeCalc.multiply(totalAmount, 1.2).toString())}%)`,
        }}
      >
        {formatNumber(toPercentage(value, totalAmount), 0)}%
      </p>
    </section>
  );
}
