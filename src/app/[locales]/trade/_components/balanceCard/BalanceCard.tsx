"use client";

import WalletIcon from "@/public/svg/wallet.svg";
import { KRWO } from "@/src/lib/constants/token";
import { fetchGetBalance } from "@/src/lib/utils/api/fetchGetBalance";
import { useQueries } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { safeCalc } from "@/src/lib/utils/safeCalc";
import { insertComma } from "@/src/lib/utils/insertComma";
import { GetBalanceResponseType } from "@/src/lib/types/api/GetBalanceType";
import { checkIsAvailableChain } from "@/src/lib/utils/checkIsAvailableChain";
import ExclamationMarkIcon from "@/public/svg/exclamation.svg";
import UnsupportedNetworkOrNeedConnect from "./UnsupportedNetworkOrNeedConnect";

export default function BalanceCard() {
  const { address, chainId, isConnected } = useAccount();

  const [{ data: balance }] = useQueries({
    queries: [
      {
        queryKey: ["getBalance", address, chainId],
        queryFn: () =>
          fetchGetBalance({
            walletAddress: address!,
            chainId: chainId!,
          }),
        enabled: !!(address && checkIsAvailableChain(chainId)),
        select: (data: GetBalanceResponseType) => data.balance,
      },
    ],
  });

  const totalBalance = () => {
    if (!checkIsAvailableChain(chainId)) return "0";
    if (!balance?.krwo) return "-";
    return insertComma(
      safeCalc
        .divide(balance.krwo, 10 ** KRWO.decimal)
        .floor()
        .toString(),
    );
  };

  return (
    <section className="shadow-customShadow p-4 rounded-2xl bg-black-1 flex flex-col max-w-[480px] m-[0_auto] relative z-10">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-1 items-center">
          {checkIsAvailableChain(chainId) || !isConnected ? (
            <div className="p-1 bg-purple-50 rounded-full">
              <WalletIcon className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1 bg-[#FDEDED] rounded-full">
              <ExclamationMarkIcon className="w-4 h-4" />
            </div>
          )}
          <h5>
            <span className="font-bold">{totalBalance()}</span> {KRWO.symbol}
          </h5>
        </div>
      </div>
      {checkIsAvailableChain(chainId) ? (
        <></>
      ) : (
        <UnsupportedNetworkOrNeedConnect />
      )}
    </section>
  );
}
