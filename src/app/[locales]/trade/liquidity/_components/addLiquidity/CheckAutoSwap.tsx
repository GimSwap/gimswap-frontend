import Lottie from 'lottie-react';
import AutoSwapLottie from '@/public/lottie/autoSwap.json';
import StarIcon from '@/public/svg/star.svg';
import CheckBoxIcon from '@/public/svg/checkBox.svg';

interface CheckAutoSwapProps {
  mode: 'auto' | 'normal';
  setMode: React.Dispatch<React.SetStateAction<'auto' | 'normal'>>;
}

export default function CheckAutoSwap({ mode, setMode }: CheckAutoSwapProps) {
  return (
    <div
      className="flex flex-row justify-center gap-1 cursor-pointer pt-2 items-center"
      onClick={() => setMode((prev) => (prev === 'auto' ? 'normal' : 'auto'))}
    >
      <CheckBoxIcon
        className={`${mode === 'auto' ? 'stroke-purple-500' : 'stroke-black-6'} w-6 h-6`}
      />
      <h5
        className={`${
          mode === 'auto' ? 'text-purple-500' : 'text-black-6'
        } font-medium`}
      >
        Insufficient tokens{' '}
        <span className="font-bold underline underline-offset-[2.5px]">
          AutoSwap
        </span>
      </h5>
      {mode === 'auto' ? (
        <Lottie animationData={AutoSwapLottie} loop className="w-5 h-5" />
      ) : (
        <StarIcon />
      )}
    </div>
  );
}
