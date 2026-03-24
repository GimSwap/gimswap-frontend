"use client";

import { useReadContracts } from "wagmi";
import ExchangeIcon from "@/public/svg/exchange.svg";
import { CONTRACT_ADDRESS_MAP } from "@/src/lib/constants/token";
import { chains } from "@/src/lib/utils/wagmi";
import AmountPerChain from "./AmountPerChain";
import ERC20Abi from "@/src/lib/utils/abis/ERC20Abi.json";
import type { Abi } from "viem";

export default function BlocksAmount() {
  const { data } = useReadContracts({
    contracts: chains.map((chain) => ({
      abi: ERC20Abi as Abi,
      address: CONTRACT_ADDRESS_MAP.OV[chain.id] as `0x${string}`,
      functionName: "balanceOf" as const,
      args: [CONTRACT_ADDRESS_MAP.GIMSWAP[chain.id] as `0x${string}`],
      chainId: chain.id,
    })),
  });

  const lockedAmounts =
    data?.map((result) => {
      if (result.status === "success") {
        return Number(result.result) / 1e6;
      }
      return 0;
    }) ?? [];

  const totalLockedAmount = lockedAmounts.reduce(
    (acc, amount) => acc + amount,
    0,
  );

  return (
    <section className="flex w-full flex-col items-center bg-black-13 px-4 py-10">
      <div className="relative flex w-full max-w-[1008px] flex-col gap-2 lg:flex-row">
        <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-purple-200 bg-[rgba(255,255,255,0.1)] p-6 lg:items-center">
          <p className="p1 text-black-1">Total Locked Open Voucher</p>
          <h3 className="min-h-7 font-bold text-black-1">
            {totalLockedAmount
              ? `${totalLockedAmount.toLocaleString()} OV`
              : "-"}
          </h3>
        </div>
        <div className="flex flex-1 flex-col gap-1 rounded-2xl border border-purple-200 bg-[rgba(255,255,255,0.1)] p-6 lg:items-center">
          <p className="p1 text-black-1">KRWO total supply</p>
          <h3 className="min-h-7 font-bold text-black-1">
            {totalLockedAmount
              ? `${totalLockedAmount.toLocaleString()} KRWO`
              : "-"}
          </h3>
        </div>
        <ExchangeIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <section className="mt-4 flex w-full max-w-[1008px] flex-col gap-2 lg:flex-row">
        {chains.map((chain, index) => (
          <AmountPerChain
            key={index}
            chainId={chain.id}
            lockedAmount={lockedAmounts[index] ?? 0}
          />
        ))}
      </section>
    </section>
  );
}
