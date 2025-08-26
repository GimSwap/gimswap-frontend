"use client";

import { useEffect, useState } from "react";
import ArrowDownIcon from "@/public/svg/arrow/arrow-down.svg";
import { useGetFee } from "@/src/lib/hook/useGetFee";
import SwapButtonAndPriceInfo from "@/src/app/[locales]/trade/get-krwo/_components/swapButtonAndPriceInfo/SwapButtonAndPriceInfo";
import { useSwitchTokenOrder } from "../_hooks/useSwitchTokenOrder";
import Token from "@/src/app/[locales]/trade/get-krwo/_components/Token";
import TokenContainer from "./TokenContainer";
import GradientButton from "./GradientButton";
import { OPEN_VOUCHER } from "@/src/lib/constants/token";
import PlusIcon from "@/public/svg/plus.svg";
import { safeCalc } from "@/src/lib/utils/safeCalc";
import { useQueries } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { fetchGetBalance } from "@/src/lib/utils/api/fetchGetBalance";
import { checkIsAvailableChain } from "@/src/lib/utils/checkIsAvailableChain";
import { GetBalanceResponseType } from "@/src/lib/types/api/GetBalanceType";
import { fetchGetServiceFee } from "@/src/lib/utils/api/swap/fetchGetServiceFee";
import { GetServiceFeeResponseType } from "@/src/lib/types/api/swap/GetServiceFeeType";

export default function SwapInput() {
  const [amount, setAmount] = useState<string>("0");
  const { selectedTokens, switchTokenOrder } = useSwitchTokenOrder();
  const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>(true);
  const [rerenderTrigger, setRerenderTrigger] = useState<number>(0);
  const [isServiceFeeActive, setIsServiceFeeActive] = useState<boolean>(false);

  const { fee } = useGetFee(amount);
  const { address, chainId } = useAccount();

  const [{ data: nativeBalance }, { data: serviceFee }] = useQueries({
    queries: [
      {
        queryKey: ["getBalance", address, chainId],
        queryFn: () =>
          fetchGetBalance({
            walletAddress: address!,
            chainId: chainId!,
          }),
        enabled: !!(address && checkIsAvailableChain(chainId)),
        select: (data: GetBalanceResponseType) => data.balance.native,
        refetchInterval: 2000,
      },
      {
        queryKey: ["getServiceFee", chainId],
        queryFn: () => fetchGetServiceFee({ chainId: chainId! }),
        enabled: !!(chainId && checkIsAvailableChain(chainId)),
        select: (data: GetServiceFeeResponseType) => data.amount,
      },
    ],
  });

  useEffect(() => {
    if (nativeBalance === "0") setIsServiceFeeActive(true);
  }, [nativeBalance]);

  return (
    <>
      <section className="relative flex flex-col gap-2 my-4 items-center">
        <TokenContainer token={selectedTokens.pay}>
          {selectedTokens.pay === OPEN_VOUCHER && (
            <GradientButton href="/trade/get-krwo/add-ov/buy-ov">
              <div className="flex flex-row gap-1 items-center justify-center">
                <PlusIcon className="w-[10px] h-[10px] stroke-purple-500" />
                <p className="p1 font-bold text-purple-500">Add OV</p>
              </div>
            </GradientButton>
          )}
          <Token
            key={`pay-${rerenderTrigger}`}
            type="pay"
            token={selectedTokens.pay}
            setAmount={setAmount}
            amount={amount}
            setIsEnoughBalance={setIsEnoughBalance}
          />
        </TokenContainer>
        <button
          className="p-2 bg-purple-500 rounded-full lg:hover:rotate-180 duration-200 w-fit -my-6 z-10"
          onClick={() => {
            switchTokenOrder();
            setIsServiceFeeActive(false);
          }}
        >
          <ArrowDownIcon />
        </button>
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
