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
    <section className="py-10 px-4 bg-black-13 flex flex-col items-center w-full">
      <div className="relative flex flex-col lg:flex-row gap-2 max-w-[1008px] w-full">
        <div className="rounded-2xl border border-purple-200 p-6 flex flex-col gap-1 bg-[rgba(255,255,255,0.1)] flex-1 lg:items-center">
          <p className="p1 text-black-1">Total Locked Open Voucher</p>
          <h3 className="font-bold text-black-1 min-h-7">
            {totalLockedAmount &&
              `${(Number(totalLockedAmount) / 10000).toLocaleString()} OV`}
          </h3>
        </div>
        <div className="rounded-2xl border border-purple-200 p-6 flex flex-col gap-1 bg-[rgba(255,255,255,0.1)] flex-1 lg:items-center">
          <p className="p1 text-black-1">KRWO total supply</p>
          <h3 className="font-bold text-black-1 min-h-7">
            {totalLockedAmount && `${totalLockedAmount.toLocaleString()} KRWO`}
          </h3>
        </div>
        <ExchangeIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <section className="w-full flex lg:flex-row flex-col max-w-[1008px] gap-2 mt-4">
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
