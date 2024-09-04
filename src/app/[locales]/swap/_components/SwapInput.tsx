"use client";

import { useState } from "react";
import Token from "./Token";
import { OPEN_VOUCHER, TOT } from "@/src/lib/constants/token";
import ArrowDownIcon from "@/public/svg/arrow/arrow-down.svg";
import TransactionDetails from "./TransactionDetails";
import { TokenType } from "@/src/lib/types/TokenType";
import { usePopupStore } from "@/src/lib/stores/popupStore/PopupStoreProvider";
import SwapConfirmPopup from "@/src/components/popups/SwapConfirmPoup";
import Button from "@/src/components/Button";
import { useGetFee } from "@/src/lib/hook/useGetFee";

export default function SwapInput() {
  const [amount, setAmount] = useState<BigInt>(BigInt(0));
  const [selectedTokens, setSelectedTokens] = useState<{
    pay: TokenType;
    receive: TokenType;
  }>({ pay: OPEN_VOUCHER, receive: TOT });
  const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>(true);

  const { fee } = useGetFee(selectedTokens.pay.contractAddress);

  const { openPopup } = usePopupStore((state) => state);

  const buttonTitle = () => {
    if (!amount) return "Enter an amount";
    if (!isEnoughBalance) return "Insufficient Balance";
    else return "swap";
  };

  return (
    <section className="shadow-customShadow p-6 w-full max-w-[496px] rounded-2xl bg-black-1 z-10">
      <section className="relative flex flex-col gap-3 mb-4">
        <Token
          type="pay"
          token={selectedTokens.pay}
          setAmount={setAmount}
          amount={amount}
          setIsEnoughBalance={setIsEnoughBalance}
          isWritable={selectedTokens.receive !== OPEN_VOUCHER}
        />
        <button
          className="p-2 bg-purple-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:hover:rotate-180 duration-200"
          onClick={() => {
            setSelectedTokens((prev) => ({
              pay: prev.receive,
              receive: prev.pay,
            }));
            setAmount(BigInt(0));
          }}
        >
          <ArrowDownIcon />
        </button>
        <Token
          type="receive"
          token={selectedTokens.receive}
          amount={amount}
          setAmount={setAmount}
          isWritable={selectedTokens.receive === OPEN_VOUCHER}
        />
      </section>
      <TransactionDetails
        contractAddress={selectedTokens.pay.contractAddress}
      />
      <Button
        onClick={() =>
          openPopup(SwapConfirmPopup, {
            tokens: selectedTokens,
            amount,
            fee,
          })
        }
        title={buttonTitle()}
        disabled={!amount || !isEnoughBalance}
        className="bg-purple-500 text-black-1 mt-6"
      />
    </section>
  );
}
