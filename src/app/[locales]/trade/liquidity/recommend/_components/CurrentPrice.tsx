import USDTIcon from '@/public/svg/token/USDT.svg';
import KRWOIcon from '@/public/svg/token/KRWO-resizable.svg';

interface CurrentPriceProps {
  currentPrice: number;
}

export default function CurrentPrice({ currentPrice }: CurrentPriceProps) {
  return (
    <section>
      <div className="flex-row flex justify-between">
        <div className="flex flex-row gap-1">
          <p className="c1 text-black-8">USDT-KRWO 0.2%</p>
          <div className="flex flex-row">
            <USDTIcon className="w-4 h-4 mr-[-3px] border border-black-1 z-10 rounded-full" />
            <KRWOIcon className="w-4 h-4" />
          </div>
        </div>
        <p className="c1 text-black-8">
          Current Price
          <span className="font-bold">
            {` ₩ ${Math.floor(currentPrice).toLocaleString('ko-kr')}`}
          </span>
        </p>
      </div>
    </section>
  );
}
