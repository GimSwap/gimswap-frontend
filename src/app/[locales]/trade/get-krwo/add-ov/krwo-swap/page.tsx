'use client';

import { KRWO, OPEN_VOUCHER } from '@/src/lib/constants/token';
import TokenContainer from '@/src/app/[locales]/trade/get-krwo/_components/TokenContainer';
import Token from '@/src/app/[locales]/trade/get-krwo/_components/Token';
import { useState } from 'react';
import ArrowDownIcon from '@/public/svg/arrow/arrow-down.svg';
import SwapButtonAndPriceInfo from '@/src/app/[locales]/trade/get-krwo/_components/swapButtonAndPriceInfo/SwapButtonAndPriceInfo';
import { useRouter } from '@/src/i18n/routing';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { GetServiceFeeResponseType } from '@/src/lib/types/api/swap/GetServiceFeeType';
import { fetchGetServiceFee } from '@/src/lib/utils/api/swap/fetchGetServiceFee';
import { GetBalanceResponseType } from '@/src/lib/types/api/GetBalanceType';
import { fetchGetBalance } from '@/src/lib/utils/api/fetchGetBalance';
import { useQueries } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export default function KrwoSwap() {
  const router = useRouter();
  const [amount, setAmount] = useState('0');
  const [isEnoughBalance, setIsEnoughBalance] = useState(false);
  const [isServiceFeeActive, setIsServiceFeeActive] = useState<boolean>(false);
  const { address, chainId } = useAccount();

  const [{ data: nativeBalance }, { data: serviceFee }] = useQueries({
    queries: [
      {
        queryKey: ['getBalance', address, chainId],
        queryFn: () =>
          fetchGetBalance({
            walletAddress: address!,
            chainId: chainId!,
          }),
        enabled: !!(address && checkIsAvailableChain(chainId)),
        select: (data: GetBalanceResponseType) => data.balance.native,
        refetchInterval: 2000,
      },
      {
        queryKey: ['getServiceFee', chainId],
        queryFn: () => fetchGetServiceFee({ chainId: chainId! }),
        enabled: !!(chainId && checkIsAvailableChain(chainId)),
        select: (data: GetServiceFeeResponseType) => data.amount,
      },
    ],
  });

  return (
    <section className="relative flex flex-col gap-2 my-4 items-center">
      <TokenContainer token={OPEN_VOUCHER}>
        <Token
          type="pay"
          token={OPEN_VOUCHER}
          setAmount={setAmount}
          amount={amount}
          setIsEnoughBalance={setIsEnoughBalance}
        />
      </TokenContainer>
      <button className="p-2 bg-black-5 rounded-full lg:hover:rotate-180 duration-200 w-fit -my-6 z-10">
        <ArrowDownIcon />
      </button>
      <TokenContainer token={KRWO}>
        <Token
          type="receive"
          token={KRWO}
          setAmount={setAmount}
          amount={amount}
        />
      </TokenContainer>
      <SwapButtonAndPriceInfo
        fee={0}
        isEnoughBalance={isEnoughBalance}
        isServiceFeeActive={isServiceFeeActive}
        setIsServiceFeeActive={setIsServiceFeeActive}
        tokens={{
          pay: {
            ...OPEN_VOUCHER,
            amount: safeCalc.divide(amount, OPEN_VOUCHER.unit).toString(),
            value: amount,
          },
          receive: {
            ...KRWO,
            amount: amount,
            value: amount,
          },
        }}
        onComplete={() => {
          router.push('/trade/get-krwo');
        }}
        nativeBalance={nativeBalance}
        serviceFee={serviceFee}
      />
    </section>
  );
}
