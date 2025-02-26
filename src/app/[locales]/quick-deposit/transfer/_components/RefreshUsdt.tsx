import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import refreshLottie from '@/public/lottie/refresh-arrow.json';
import { useCallback, useRef } from 'react';
import throttle from '@/src/lib/utils/throttle';
import { useQueryClient } from '@tanstack/react-query';
import { bsc } from 'wagmi/chains';

export default function RefreshUsdt() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const queryClient = useQueryClient();

  const handleInvalidQuery = () => {
    queryClient.invalidateQueries({
      queryKey: ['getUsdtTick', bsc.id],
    });
  };

  const handleRefresh = useCallback(
    throttle(() => {
      lottieRef.current?.goToAndPlay(0);
      handleInvalidQuery();
    }, 3000),
    [handleInvalidQuery],
  );

  return (
    <Lottie
      animationData={refreshLottie}
      loop={false}
      lottieRef={lottieRef}
      onClick={handleRefresh}
      className="w-4 h-[16px] cursor-pointer"
    />
  );
}
