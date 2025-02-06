'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchGetCurrentTick } from '@/src/lib/utils/api/liquidity/fetchGetCurrentTick';
import { useAccount } from 'wagmi';
import { usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { GetCurrentTickResponseType } from '@/src/lib/types/api/liquidity/GetCurrentTickType';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { KRWO, TOKEN_MAP, USDT } from '@/src/lib/constants/token';
import { defaultChain } from '@/src/lib/constants/token';

export default function CurrentPrice() {
  const { chainId } = useAccount();

  const chainIdParam =
    chainId && checkIsAvailableChain(chainId) ? chainId : defaultChain.id;

  const { data: currentTick, isLoading: isLoadingCurrentTick } = useQuery({
    queryKey: ['currentTick', chainIdParam],
    queryFn: () =>
      fetchGetCurrentTick({ chainId: chainIdParam, token: 'usdt' }),
    refetchInterval: 5000,
    select: (data: GetCurrentTickResponseType) => data.currentTick,
  });

  const currentPrice = +usdtTickToKrw(currentTick!, chainIdParam);
  const KRWOIcon = KRWO.icon[chainIdParam];
  const fee =
    TOKEN_MAP[checkIsAvailableChain(chainId) ? chainId : defaultChain.id].native
      .fee;

  return (
    <section>
      <div className="flex-row flex justify-between">
        <div className="flex flex-row gap-1">
          <p className="c1 text-black-8">USDT-KRWO {fee}%</p>
          <div className="flex flex-row">
            <USDT.icon className="w-4 h-4 mr-[-3px] border border-black-1 z-10 rounded-full" />
            <KRWOIcon className="w-4 h-4" />
          </div>
        </div>
        <p className="c1 text-black-8">
          Current Price
          <span className="font-bold">
            {` ₩ ${isLoadingCurrentTick ? '-' : Math.floor(currentPrice).toLocaleString('ko-kr')}`}
          </span>
        </p>
      </div>
    </section>
  );
}
