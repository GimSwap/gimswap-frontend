"use client";

import OpenVoucherIcon from "@/public/svg/token/open-voucher.svg";
import KrFlagIcon from "@/public/svg/token/kr-flag.svg";
import { safeCalc } from "@/src/lib/utils/safeCalc";
import { useState } from "react";
import BuyButton from "./BuyButton";
import { insertComma } from "@/src/lib/utils/insertComma";

const OPEN_VOUCHER_UNIT = 10000;

export default function BuyInput() {
  const [amount, setAmount] = useState<string>("1");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) return;
    setAmount(e.target.value);
  };

  return (
    <section className="flex flex-col gap-3">
      <section className="rounded-lg bg-black-3 px-4 py-6">
        <section className="flex justify-between pb-1 cursor-pointer">
          <p className="c1 font-medium">You pay</p>
          <div className="py-[6px] px-2 bg-black-1 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex gap-1 items-center">
            <KrFlagIcon />
            <p className="c1 font-medium">KRW</p>
          </div>
        </section>
        <div className="mb-[2px]">
          <input
            type="tel"
            disabled
            value={insertComma(
              safeCalc.multiply(amount, OPEN_VOUCHER_UNIT).toFixed(),
            )}
            inputMode="numeric"
            placeholder="0"
            className="font-bold text-h2 w-full placeholder-black-6 text-black-6"
          />
        </div>
      </section>
      <section className="rounded-lg bg-black-3 p-4 border border-purple-500">
        <section className="flex justify-between pb-1 cursor-pointer">
          <p className="c1 font-medium">You receive</p>
          <div className="py-[6px] px-2 bg-black-1 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex gap-1 items-center">
            <OpenVoucherIcon />
            <p className="c1 font-medium">Open Voucher</p>
          </div>
        </section>
        <div className="mb-[2px]">
          <input
            type="tel"
            value={amount}
            inputMode="numeric"
            placeholder="0"
            onChange={handleAmountChange}
            className="font-bold text-h2 w-full"
          />
        </div>
      </section>
      <BuyButton amount={amount} />
    </section>
  );
}
