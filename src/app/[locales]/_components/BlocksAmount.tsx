import ExchangeIcon from '@/public/svg/exchange.svg';
import { GetBlockAmountResponseType } from '@/src/lib/types/api/GetBlockAmountType';
import { chains } from '@/src/lib/utils/wagmi';
import AmountPerChain from './AmountPerChain';

interface BlocksAmountProps {
  lockedAmounts: GetBlockAmountResponseType[];
}

export default function BlocksAmount({ lockedAmounts }: BlocksAmountProps) {
  const totalLockedAmount = lockedAmounts.reduce(
    (acc, amount) => acc + amount.locked,
    0,
  );

  return (
    <section className="flex w-full flex-col items-center bg-black-13 px-4 py-10">
      <div className="relative flex w-full max-w-[1008px] flex-col gap-2 lg:flex-row">
        <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-purple-200 bg-[rgba(255,255,255,0.1)] p-6 lg:items-center">
          <p className="p1 text-black-1">Total Locked Open Voucher</p>
          <h3 className="min-h-7 font-bold text-black-1">
            {totalLockedAmount &&
              `${(Number(totalLockedAmount) / 10000).toLocaleString()} OV`}
          </h3>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-purple-200 bg-[rgba(255,255,255,0.1)] p-6 lg:items-center">
          <p className="p1 text-black-1">KRWO total supply</p>
          <h3 className="min-h-7 font-bold text-black-1">
            {totalLockedAmount && `${totalLockedAmount.toLocaleString()} KRWO`}
          </h3>
        </div>
        <ExchangeIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <section className="mt-4 flex w-full max-w-[1008px] flex-col gap-2 lg:flex-row">
        {chains.map((chain, index) => (
          <AmountPerChain
            key={index}
            locked={lockedAmounts[index].locked}
            chainId={chain.id}
          />
        ))}
      </section>
    </section>
  );
}
