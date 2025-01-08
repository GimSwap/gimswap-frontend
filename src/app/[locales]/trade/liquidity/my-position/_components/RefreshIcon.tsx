import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import refreshLottie from '@/public/lottie/refresh.json';
import { useRef } from 'react';
import throttle from '@/src/lib/utils/throttle';
import { revalidateTags } from '@/src/lib/utils/serverAction/revalidateTags';

interface RefreshIconProps {
  refetch: () => void;
}
export default function RefreshIcon({ refetch }: RefreshIconProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const handleRefresh = throttle(async () => {
    lottieRef.current?.goToAndPlay(0);
    await revalidateTags('liquidity-positions');
    refetch();
  }, 2000);

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
