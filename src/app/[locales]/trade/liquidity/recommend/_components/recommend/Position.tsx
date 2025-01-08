import DGSwapIcon from '@/src/assets/icons/dg-swap.png';
import Lottie from 'lottie-react';
import { broad, downTrend, narrow, upTrend } from '@/public/lottie/position';
import Image, { StaticImageData } from 'next/image';
import Chip from '@/src/components/Chip';
import { PositionType } from '../../_mock/liquidityAmount';

const positionMap: Record<
  PositionType['label'],
  { title: string; icon: React.ReactNode }
> = {
  broad: {
    title: 'Broad',
    icon: (
      <Lottie animationData={broad} loop={true} className="w-4 h-4 rotate-90" />
    ),
  },
  narrow: {
    title: 'Narrow',
    icon: (
      <Lottie
        animationData={narrow}
        loop={true}
        className="w-4 h-4 rotate-90"
      />
    ),
  },
  uptrend: {
    title: 'Uptrend',
    icon: <Lottie animationData={upTrend} loop={true} className="w-4 h-4" />,
  },
  downtrend: {
    title: 'Downtrend',
    icon: <Lottie animationData={downTrend} loop={true} className="w-4 h-4" />,
  },
};

interface PositionProps extends Omit<PositionType, 'currentPrice'> {
  dexIcon?: StaticImageData;
  isSelected: boolean;
}

export default function Position({
  dexIcon = DGSwapIcon,
  label,
  lowerTick,
  upperTick,
  apr,
  isSelected,
}: PositionProps) {
  return (
    <section
      className={`p-4 border rounded-lg flex flex-col ${isSelected ? 'border-purple-500' : 'border-black-4'} cursor-pointer`}
    >
      <div className="flex flex-row gap-1 mb-2 items-center">
        <Image
          src={dexIcon}
          alt={positionMap[label.toLowerCase()].title}
          width={24}
          height={24}
          className="max-w-6 max-h-6"
        />
        <Chip color="purpleOutline" className="gap-1">
          {positionMap[label.toLowerCase()].title}
          {positionMap[label.toLowerCase()].icon}
        </Chip>
      </div>
      <p className="p1 font-bold mb-[2px]">
        ₩ {lowerTick.toLocaleString('ko-KR')} ⇌ ₩{' '}
        {upperTick.toLocaleString('ko-KR')}
      </p>
      <p className="c1 text-purple-500">APR ≈ {Math.floor(apr * 100)}%</p>
    </section>
  );
}
