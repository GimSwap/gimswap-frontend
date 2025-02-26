import { USDT } from '@/src/lib/constants/token';
import ArrowDownIcon from '@/public/svg/arrow/arrow-down-resizable.svg';
import { WALLET_ICONS } from '@/src/lib/constants/walletIcons';

interface AmountToSendBoxProps {
  Icon?: React.ElementType;
  ReceiverIcon?: React.ElementType;
  symbol?: string;
  amount: string;
  className?: string;
}

export default function AmountToSendBox({
  Icon = USDT.icon,
  ReceiverIcon = WALLET_ICONS['Binance Wallet'],
  amount,
  symbol = USDT.symbol,
  className,
}: AmountToSendBoxProps) {
  return (
    <section
      className={`p-4 flex flex-col gap-[6px] items-center justify-center bg-black-3 rounded-lg w-full ${className}`}
    >
      <div className="flex flex-row gap-2 items-center">
        <Icon className="w-5 h-[20px]" />
        <h5 className="font-medium text-black-8">
          {amount} {symbol}
        </h5>
      </div>
      <ArrowDownIcon className="w-5 h-[20px] stroke-black-8" />
      <div className="flex flex-row gap-2 items-center">
        <ReceiverIcon className="w-5 h-[20px]" />
        <h5 className="font-medium text-black-8">Binance Wallet</h5>
      </div>
    </section>
  );
}
