'use client';

import WalletIcon from '@/public/svg/wallet.svg';
import { defaultChain, KRWO, TOKEN_MAP, USDT } from '@/src/lib/constants/token';
import { fetchGetBalance } from '@/src/lib/utils/api/fetchGetBalance';
import { useQueries } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { insertComma } from '@/src/lib/utils/insertComma';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { calcKrwPrice } from '@/src/lib/utils/calcTick';
import { GetBalanceResponseType } from '@/src/lib/types/api/GetBalanceType';
import { fetchGetCurrentTick } from '@/src/lib/utils/api/liquidity/fetchGetCurrentTick';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import ExclamationMarkIcon from '@/public/svg/exclamation.svg';
import BalanceChart from './BalanceChart';
import UnsupportedNetworkOrNeedConnect from './UnsupportedNetworkOrNeedConnect';
import PlusIcon from '@/public/svg/plus.svg';
import { useRouter } from '@/src/i18n/routing';

export default function BalanceCard() {
  const router = useRouter();
  const { address, chainId, isConnected } = useAccount();

  const [{ data: balance }, { data: usdtTick }, { data: nativeTick }] =
    useQueries({
      queries: [
        {
          queryKey: ['getBalance', address, chainId],
          queryFn: () =>
            fetchGetBalance({
              walletAddress: address!,
              chainId: chainId!,
            }),
          enabled: !!(address && checkIsAvailableChain(chainId)),
          select: (data: GetBalanceResponseType) => data.balance,
        },
        {
          queryKey: ['getUsdtTick', chainId],
          queryFn: () =>
            fetchGetCurrentTick({
              chainId: chainId!,
              token: 'usdt',
            }),
          enabled: !!checkIsAvailableChain(chainId),
        },
        {
          queryKey: ['getNativeTick', chainId],
          queryFn: () =>
            fetchGetCurrentTick({
              chainId: chainId!,
              token:
                TOKEN_MAP[chainId as ChainIdType].native.symbol.toLowerCase(),
            }),
          enabled: checkIsAvailableChain(chainId),
        },
      ],
    });

  const usdtPrice = calcKrwPrice(
    chainId,
    usdtTick?.currentTick,
    balance?.usdt,
    USDT.decimal[checkIsAvailableChain(chainId) ? chainId : defaultChain.id],
    'usdt',
  );

  const nativePrice = calcKrwPrice(
    chainId,
    nativeTick?.currentTick,
    balance?.native,
    TOKEN_MAP[checkIsAvailableChain(chainId) ? chainId : defaultChain.id].native
      .decimal,
    TOKEN_MAP[checkIsAvailableChain(chainId) ? chainId : defaultChain.id].native
      .symbol,
  );

  const rewardAmount = calcKrwPrice(
    chainId,
    nativeTick?.currentTick,
    balance?.reward,
    TOKEN_MAP[checkIsAvailableChain(chainId) ? chainId : defaultChain.id].reward
      .decimal,
    TOKEN_MAP[checkIsAvailableChain(chainId) ? chainId : defaultChain.id].reward
      .symbol,
  );

  const totalBalance = () => {
    if (!checkIsAvailableChain(chainId)) return '0';
    if (!balance?.krwo) return '-';
    return insertComma(
      safeCalc
        .divide(balance.krwo, 10 ** KRWO.decimal)
        .floor()
        .toString(),
    );
  };

  const handleClickAddButton = () => {
    if (!chainId || !checkIsAvailableChain(chainId) || !address) return;
    router.push('/trade/get-krwo');
  };

  return (
    <section className="shadow-customShadow p-4 rounded-2xl bg-black-1 flex flex-col max-w-[480px] m-[0_auto] relative z-10">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-1 items-center">
          {checkIsAvailableChain(chainId) || !isConnected ? (
            <div className="p-1 bg-purple-50 rounded-full">
              <WalletIcon className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1 bg-[#FDEDED] rounded-full">
              <ExclamationMarkIcon className="w-4 h-4" />
            </div>
          )}
          <h5>
            <span className="font-bold">{totalBalance()}</span> {KRWO.symbol}
          </h5>
        </div>
        <div
          className="p-[5px] bg-black-12 rounded-full cursor-pointer"
          onClick={handleClickAddButton}
        >
          <PlusIcon className="w-[10px] h-[10px] stroke-black-1" />
        </div>
      </div>
      {checkIsAvailableChain(chainId) ? (
        <BalanceChart
          balance={balance}
          nativePrice={nativePrice}
          usdtPrice={usdtPrice}
          rewardAmount={rewardAmount}
        />
      ) : (
        <UnsupportedNetworkOrNeedConnect />
      )}
    </section>
  );
}
