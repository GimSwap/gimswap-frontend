import { TokenType } from "@/src/lib/types/TokenType";
import PopupTemplate from "../PopupTemplate";
import ArrowDownIcon from "@/public/svg/arrow/arrow-narrow-down.svg";
import { safeCalc } from "@/src/lib/utils/safeCalc";
import { insertComma } from "@/src/lib/utils/insertComma";

interface SwapLoadingPopupProps {
  open: boolean;
  onClose: () => void;
  tokens: {
    pay: TokenType;
    receive: TokenType;
  };
  amount: string;
}

export default function SwapLoadingPopup({
  onClose,
  open,
  tokens,
  amount,
}: SwapLoadingPopupProps) {
  return (
    <PopupTemplate showCloseButton open={open} onClose={onClose} icon="loading">
      <section className="px-6">
        <h3 className="font-bold text-center py-4">Confirming swap</h3>
        <section className="rounded-lg bg-black-3 flex flex-col justify-center items-center p-4 gap-[6px]">
          <div className="flex gap-2 items-center">
            <tokens.pay.icon />
            <h5 className="text-black-8 font-medium">{`${insertComma(
              safeCalc.divide(amount, tokens.pay.unit).toFixed(),
            )} ${tokens.pay.name}`}</h5>
          </div>
          <ArrowDownIcon />
          <div className="flex gap-2 items-center">
            <tokens.receive.icon />
            <h5 className="text-black-8 font-medium">{`${insertComma(
              safeCalc.divide(amount, tokens.receive.unit).toFixed(),
            )} ${tokens.receive.name}`}</h5>
          </div>
        </section>
        <h5 className="font-medium text-black-6 pt-4 pb-5 text-center">
          Proceed in your wallet
        </h5>
      </section>
    </PopupTemplate>
  );
}
