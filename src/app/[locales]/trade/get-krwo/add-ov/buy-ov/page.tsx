"use client";

import { useState } from "react";
import MinusIcon from "@/public/svg/minus.svg";
import { Link } from "@/src/i18n/routing";
import KRFlagIcon from "@/public/svg/token/kr-flag.svg";
import { OPEN_VOUCHER } from "@/src/lib/constants/token";
import { safeCalc } from "@/src/lib/utils/safeCalc";
import OpenVoucherBanner from "@/public/svg/openvoucher-banner.svg";
import { insertComma } from "@/src/lib/utils/insertComma";
import Button from "@/src/components/Button";
import { useInputFocus } from "./_hooks/useInputFocus";
import { handleInputAmount } from "./_utils/handleInputAmount";
import { useGetBuyOvButtonState } from "./_hooks/useGetBuyOvButtonState";
// import { useOpenPaymentPopup } from '@/src/lib/hook/useOpenPaymentPopup';
import NoMoreAvailablePopup from "../krwo-swap/_components/NoMoreAvailablePopup";
import { usePopupStore } from "@/src/lib/stores/popupStore/PopupStoreProvider";

export default function BuyOv() {
  const [amount, setAmount] = useState("");
  const { isFocused, handleFocus, handleBlur, inputRef } = useInputFocus();
  const { buttonState } = useGetBuyOvButtonState();
  const { openPopup } = usePopupStore((state) => state);
  // const { openOVPaymentPopup } = useOpenPaymentPopup();

  return (
    <section>
      <section
        className={`flex flex-col gap-4 pt-4 border ${isFocused ? "border-purple-500" : "border-black-4"} rounded-lg`}
        onClick={handleFocus}
        onBlur={handleBlur}
      >
        <div className="px-4 flex flex-col gap-4">
          <Link
            href="/trade/get-krwo"
            className="flex items-center gfap-1 border border-black-5 rounded-lg justify-center px-3 py-[6px] bg-black-4"
          >
            <MinusIcon className="stroke-black-7" />
            <p className="p1 font-bold text-black-7">No need to Buy OV</p>
          </Link>
          <section className="flex flex-col gap-2">
            <section className="flex justify-between">
              <p className="p1 text-black-8">You pay</p>
              <div className="px-2 py-[6px] bg-black-1 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex gap-1 items-center w-fit">
                <KRFlagIcon />
                <p className="p1 font-medium">KRW</p>
              </div>
            </section>
            <h2 className="text-h2 font-bold text-black-6">
              {amount
                ? insertComma(safeCalc.multiply(amount, 10000).toString())
                : "0"}
            </h2>
          </section>
          <hr className="border-black-4" />
          <section className="flex flex-col gap-2 pb-6">
            <section className="flex justify-between">
              <p className="p1 text-black-8">You receive</p>
              <div className="px-2 py-[6px] bg-black-1 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex gap-1 items-center w-fit">
                <OPEN_VOUCHER.icon className="w-5 h-[20px]" />
                <p className="p1 font-medium">{OPEN_VOUCHER.symbol}</p>
              </div>
            </section>
            <input
              value={amount}
              className="placeholder:text-black-6 placeholder:font-bold placeholder:text-h2 text-h2 font-bold"
              placeholder="Enter amount"
              type="tel"
              onChange={(e) =>
                handleInputAmount({ value: e.target.value, setAmount })
              }
              ref={inputRef}
            />
          </section>
        </div>
        <section className="py-[10px] px-3 flex flex-row gap-1 items-center justify-center text-black-8 bg-black-3 rounded-b-lg">
          <p className="c1">Powered by</p>
          <OpenVoucherBanner />
        </section>
      </section>
      <Button
        size="xl"
        color="primary"
        className="mt-4"
        disabled={buttonState(amount).disabled}
        onClick={() => {
          openPopup(NoMoreAvailablePopup);
        }}
      >
        {buttonState(amount).text}
      </Button>
      <p
        className="pt-3 mb-3 text-black-8 text-center underline underline-offset-[2.5px] c1 cursor-pointer"
        onClick={async () => {
          openPopup(NoMoreAvailablePopup);
          // await openOVPaymentPopup({
          //   amount: amount,
          //   method: 'history',
          //   redirectOnCancel: window.location.href,
          //   redirectOnError: window.location.href,
          // });
        }}
      >
        View History
      </p>
    </section>
  );
}
