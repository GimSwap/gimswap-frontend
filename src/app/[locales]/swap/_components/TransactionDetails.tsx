'use client';

import QuestionMartIcon from '@/public/svg/circle-question.svg';

interface TransactionDetailsProps {
  fee: number | null;
}

export default function TransactionDetails({ fee }: TransactionDetailsProps) {
  return (
    <section className="flex flex-col gap-2 ">
      <p className="c1 font-medium text-black-8">Transaction Details</p>
      <div className="flex justify-between">
        <div className="flex gap-[2px]">
          <QuestionMartIcon />
          <p className="c1 font-medium text-black-8">
            GimSwap Fee ({fee ? fee?.toFixed(2) : '0.00'}%)
          </p>
        </div>
        <p className="c1 text-purple-500">Free</p>
      </div>
    </section>
  );
}
