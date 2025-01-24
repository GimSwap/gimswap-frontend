import { CHAIN_ICONS, CHAIN_NAME_MAP, KRWO } from '@/src/lib/constants/token';
import { ChainIdType } from '@/src/lib/types/ChainIdType';

interface AmountPerChainProps {
  locked: number;
  chainId: ChainIdType;
}

export default function AmountPerChain({
  locked,
  chainId,
}: AmountPerChainProps) {
  const ChainIcon = CHAIN_ICONS[chainId];
  const KRWOIcon = KRWO.icon[chainId];
  return (
    <section className="bg-[rgba(255,255,255,0.1)] rounded-2xl px-4 py-6 flex flex-col gap-3 w-full">
      <div className="bg-[rgba(255,255,255,0.1)] rounded-full px-2 py-[6px] flex flex-row gap-1 whitespace-nowrap w-fit">
        <div className="flex flex-row">
          <ChainIcon className="w-5 h-5" />
          <KRWOIcon className="w-5 h-5 ml-[-4px]" />
        </div>
        <p className="p1 text-black-1 font-medium">
          On {CHAIN_NAME_MAP[chainId]}
        </p>
      </div>
      <section className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <p className="p1 text-black-5">Locked Open Voucher</p>
          <p className="c1 font-bold text-black-1">
            {locked && `${(Number(locked) / 10000).toLocaleString()} OV`}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="p1 text-black-5">KRWO total supply</p>
          <p className="c1 font-bold text-black-1">
            {locked && `${locked.toLocaleString()} KRWO`}
          </p>
        </div>
      </section>
    </section>
  );
}
