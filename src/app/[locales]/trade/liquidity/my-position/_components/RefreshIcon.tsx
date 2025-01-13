import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import refreshLottie from '@/public/lottie/refresh.json';
import { useRef } from 'react';
import throttle from '@/src/lib/utils/throttle';
import { useAccount } from 'wagmi';

interface RefreshIconProps {
  refetch: () => void;
}
export default function RefreshIcon({ refetch }: RefreshIconProps) {
  const { address } = useAccount();
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const handleRefresh = throttle(async () => {
    if (!address) return;
    lottieRef.current?.goToAndPlay(0);
    refetch();
  }, 2000);

  if (!address) return null;

  return (
    <Lottie
      className="absolute top-[18px] right-4 h-6 w-6 cursor-pointer"
      animationData={refreshLottie}
      loop={false}
      lottieRef={lottieRef}
      onClick={handleRefresh}
    />
  );
}
