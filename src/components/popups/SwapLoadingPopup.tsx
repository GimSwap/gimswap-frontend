import PopupTemplate from '../PopupTemplate';
import ArrowDownIcon from '@/public/svg/arrow/arrow-narrow-down.svg';
import { insertComma } from '@/src/lib/utils/insertComma';
import { useAccount } from 'wagmi';
import TokenIcon from '../TokenIcon';

interface SwapLoadingPopupProps {
  open: boolean;
  onClose: () => void;
  tokens: {
    pay: {
      symbol: string;
      amount: string;
    };
    receive: {
      symbol: string;
      amount: string;
    };
  };
  closePrevPopup: () => void;
}

export default function SwapLoadingPopup({
  onClose,
  open,
  tokens,
  closePrevPopup,
}: SwapLoadingPopupProps) {
  const { chainId } = useAccount();

  return (
    <PopupTemplate
      showCloseButton
      open={open}
      onClose={() => {
        closePrevPopup();
        onClose();
      }}
      icon="loading"
    >
      <section className="px-6">
        <h3 className="font-bold text-center py-4">Confirming swap</h3>
        <section className="rounded-lg bg-black-3 flex flex-col justify-center items-center p-4 gap-[6px]">
          <div className="flex gap-2 items-center">
            <TokenIcon
              symbol={tokens.pay.symbol}
              width={20}
              height={20}
              alt={tokens.pay.symbol}
              chainId={chainId}
            />
            <h5 className="text-black-8 font-medium">{`${insertComma(
              tokens.pay.amount,
            )} ${tokens.pay.symbol}`}</h5>
          </div>
          <ArrowDownIcon />
          <div className="flex gap-2 items-center">
            <TokenIcon
              symbol={tokens.receive.symbol}
              width={20}
              height={20}
              alt={tokens.receive.symbol}
              chainId={chainId}
            />
            <h5 className="text-black-8 font-medium">{`${insertComma(
              tokens.receive.amount,
            )} ${tokens.receive.symbol}`}</h5>
          </div>
        </section>
        <h5 className="font-medium text-black-6 pt-4 pb-5 text-center">
          Proceed in your wallet
        </h5>
      </section>
    </PopupTemplate>
  );
}
