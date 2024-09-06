import { TokenType } from "@/src/lib/types/TokenType";
import PopupTemplate from "../PopupTemplate";
import ArrowDownIcon from "@/public/svg/arrow/arrow-narrow-down.svg";
import { Link } from "@/src/navigation";
import { ContractTransactionReceipt } from "ethers";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { CHAIN_ID_TO_BLOCK_EXPLORER } from "@/src/lib/constants/blockExplorer";

interface SwapProgressPopupProps {
  open: boolean;
  onClose: () => void;
  tokens: {
    pay: TokenType;
    receive: TokenType;
  };
  amount: number;
  receipt: ContractTransactionReceipt;
  closePrevPopup: () => void;
}

export default function SwapSuccessPopup({
  onClose,
  open,
  tokens,
  amount,
  receipt,
  closePrevPopup,
}: SwapProgressPopupProps) {
  const { chainId } = useWeb3ModalAccount();

  return (
    <PopupTemplate
      showCloseButton
      open={open}
      onClose={() => {
        closePrevPopup();
        onClose();
      }}
      icon="success"
    >
      <section className="px-6 flex flex-col items-center">
        <h3 className="font-bold text-center pb-4">Swap success!</h3>
        <section className="rounded-lg bg-black-3 flex flex-col justify-center items-center p-4 gap-[6px] w-full">
          <div className="flex gap-2 items-center">
            <tokens.pay.icon />
            <h5 className="text-black-8 font-medium">{`${(
              amount / tokens.pay.unit
            ).toLocaleString("ko-kr", { maximumFractionDigits: 14 })} ${
              tokens.pay.name
            }`}</h5>
          </div>
          <ArrowDownIcon />
          <div className="flex gap-2 items-center">
            <tokens.receive.icon />
            <h5 className="text-black-8 font-medium">{`${(
              amount / tokens.receive.unit
            ).toLocaleString("ko-kr", { maximumFractionDigits: 14 })} ${
              tokens.receive.name
            }`}</h5>
          </div>
        </section>
        <Link
          href={`${CHAIN_ID_TO_BLOCK_EXPLORER[chainId!]}/${receipt.hash}`}
          className="text-purple-500 underline underline-offset-[2.5px] mt-4 mb-5"
          target="_blank"
        >
          View on Explorer
        </Link>
      </section>
    </PopupTemplate>
  );
}
