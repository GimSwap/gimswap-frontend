import { fetchGetBalance } from '@/src/lib/utils/api/fetchGetBalance';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { useToolTip } from '@/src/lib/hook/useToolTip';
import { usePathname } from '@/src/i18n/routing';
import Lottie from 'lottie-react';
import bellLottie from '@/public/lottie/bell.json';
import { useEffect } from 'react';
import { ChainIdType } from '@/src/lib/types/ChainIdType';

export default function BuyTooltip() {
  const pathname = usePathname();
  const selectedMethod = pathname.split('/')[2];
  const { address, chainId } = useAccount();

  const { data } = useQuery({
    queryKey: ['getBalance'],
    queryFn: () =>
      fetchGetBalance({
        walletAddress: address!,
        chainId: chainId as ChainIdType,
      }),
    enabled: !!(address && checkIsAvailableChain(chainId)),
    select: (data) => data.balance,
  });

  const { openTooltip, Tooltip, closeTooltip } = useToolTip<typeof data>({
    closeOnClick: pathname === '/trade/buy',
    dependency: data,
  });

  useEffect(() => {
    if (
      (selectedMethod === 'swap' && Number(data?.ov) === 0) ||
      selectedMethod === 'buy'
    ) {
      openTooltip();
    } else {
      closeTooltip();
    }
  }, [selectedMethod, data, openTooltip, closeTooltip]);

  return (
    <Tooltip
      className="bg-[rgba(0,0,0,0.5)] rounded-lg -translate-y-[120%] after:left-[40%]"
      tailPosition="bottom"
    >
      <div className="px-2 py-[6px] flex flex-row gap-1">
        <Lottie animationData={bellLottie} loop={true} className="w-4 h-4" />
        <p className="text-black-1 c1">Buy Open Voucher Now!</p>
      </div>
    </Tooltip>
  );
}
