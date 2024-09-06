"use client";

import QuestionMartIcon from "@/public/svg/circle-question.svg";
import { useGetFee } from "@/src/lib/hook/useGetFee";

interface TransactionDetailsProps {
  contractAddress: string;
  amount: number;
}

export default function TransactionDetails({
  contractAddress,
  amount,
}: TransactionDetailsProps) {
  const { fee } = useGetFee(contractAddress, amount);
  return (
    <section className="flex flex-col gap-2 ">
      <p className="c1 font-medium text-black-8">Transaction Details</p>
      <div className="flex justify-between">
        <div className="flex gap-[2px]">
          <QuestionMartIcon />
          <p className="c1 font-medium text-black-8">
            GimSwap Fee ({fee ? fee?.toFixed(2) : "0.00"}%)
          </p>
        </div>
        <p className="c1 text-purple-500">Free</p>
      </div>
    </section>
  );
}
