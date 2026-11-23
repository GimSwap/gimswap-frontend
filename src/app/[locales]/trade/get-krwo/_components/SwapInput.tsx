"use client";

import { useEffect, useState } from "react";
import ArrowDownIcon from "@/public/svg/arrow/arrow-down.svg";
import { useGetFee } from "@/src/lib/hook/useGetFee";
import SwapButtonAndPriceInfo from "@/src/app/[locales]/trade/get-krwo/_components/swapButtonAndPriceInfo/SwapButtonAndPriceInfo";
import { useSwitchTokenOrder } from "../_hooks/useSwitchTokenOrder";
import Token from "@/src/app/[locales]/trade/get-krwo/_components/Token";
import TokenContainer from "./TokenContainer";
import { OPEN_VOUCHER } from "@/src/lib/constants/token";
import { safeCalc } from "@/src/lib/utils/safeCalc";
import { useAccount, useBalance } from "wagmi";

const serviceFee = 500000000;

export default function SwapInput() {
  const [amount, setAmount] = useState<string>("0");
  const { selectedTokens } = useSwitchTokenOrder();
  const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>(true);
  const [rerenderTrigger, setRerenderTrigger] = useState<number>(0);
  const [isServiceFeeActive, setIsServiceFeeActive] = useState<boolean>(false);

  const { fee } = useGetFee(amount);
  const { address, chainId } = useAccount();

  const { data } = useBalance({
    address: address,
    chainId: chainId,
    query: {
      refetchInterval: 2000,
    },
  });

  const nativeBalance = data?.formatted;

  useEffect(() => {
    if (nativeBalance === "0") setIsServiceFeeActive(true);
  }, [nativeBalance]);

  return (
    <>
      <section className="relative flex flex-col gap-2 my-4 items-center">
        <TokenContainer token={selectedTokens.pay}>
          <Token
            key={`pay-${rerenderTrigger}`}
            type="pay"
            token={selectedTokens.pay}
            setAmount={setAmount}
            amount={amount}
            setIsEnoughBalance={setIsEnoughBalance}
          />
        </TokenContainer>
        <div className="p-2 bg-purple-500 rounded-full  duration-200 w-fit -my-6 z-10">
          <ArrowDownIcon />
        </div>
        <TokenContainer token={selectedTokens.receive}>
          <Token
            key={`receive-${rerenderTrigger}`}
            type="receive"
            token={selectedTokens.receive}
            amount={amount}
            setAmount={setAmount}
            serviceFee={serviceFee}
            isServiceFeeActive={isServiceFeeActive}
          />
        </TokenContainer>
      </section>
      {selectedTokens.receive.symbol !== OPEN_VOUCHER.symbol &&
        amount !== "0" && (
          <p className="c1 text-error">Swap OV is not available</p>
        )}
      <SwapButtonAndPriceInfo
        fee={fee}
        isEnoughBalance={isEnoughBalance}
        tokens={{
          pay: {
            ...selectedTokens.pay,
            amount: safeCalc.divide(amount, selectedTokens.pay.unit).toString(),
            value: amount,
          },
          receive: {
            ...selectedTokens.receive,
            amount: safeCalc
              .divide(amount, selectedTokens.receive.unit)
              .toString(),
            value: amount,
          },
        }}
        isServiceFeeActive={isServiceFeeActive}
        setIsServiceFeeActive={setIsServiceFeeActive}
        onComplete={() => {
          setRerenderTrigger((prev) => prev + 1);
          setAmount("0");
        }}
        nativeBalance={nativeBalance}
        serviceFee={serviceFee}
      />
    </>
  );
}
