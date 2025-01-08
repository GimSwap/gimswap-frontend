'use client';

import WalletIcon from '@/public/svg/wallet.svg';
import { KRWO, OPEN_VOUCHER } from '@/src/lib/constants/token';
import { Link } from '@/src/i18n/routing';
import { fetchGetBalance } from '@/src/lib/utils/api/fetchGetBalance';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { insertComma } from '@/src/lib/utils/insertComma';

export default function BalanceCard() {
  const { address } = useAccount();

  const { data } = useQuery({
    queryKey: ['getBalance'],
    queryFn: () => fetchGetBalance({ walletAddress: address! }),
    enabled: !!address,
    select: (data) => data.balance,
  });

  return (
    <section className="shadow-customShadow p-4 rounded-2xl bg-black-1 flex flex-col max-w-[480px] m-[0_auto] relative z-10">
      <div className="flex flex-row gap-1 pb-1 items-center">
        <div className="py-1 px-1 bg-purple-50 rounded-full">
          <WalletIcon className="w-4 h-4" />
        </div>
        <p className="c1">My Balance</p>
      </div>
      <h5>
        <span className="font-bold">
          {data?.krwo
            ? insertComma(
                safeCalc
                  .divide(data.krwo, 10 ** KRWO.decimal)
                  .floor()
                  .toString(),
              )
            : '0'}
        </span>{' '}
        {KRWO.symbol}
      </h5>
      <hr className="border-black-4 my-2" />
      <div className="flex flex-row items-center justify-between">
        <p className="c1 text-black-8">OV available for Swap</p>
        <div className="flex flex-row gap-2 items-center">
          <p className="c1 text-black-8">
            <span className="font-bold">
              {data?.ov
                ? insertComma(
                    safeCalc
                      .divide(data.ov, 10 ** OPEN_VOUCHER.decimal)
                      .floor()
                      .toString(),
                  )
                : '0'}
            </span>{' '}
            {OPEN_VOUCHER.symbol}
          </p>
          <Link
            href="/trade/buy"
            className="bg-black-12 rounded-[50px] py-2 px-[10px] c1 font-medium text-black-1"
          >
            Add
          </Link>
        </div>
      </div>
    </section>
  );
}
