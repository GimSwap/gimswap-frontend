'use client';

import QuestionMartIcon from '@/public/svg/circle-question.svg';
import Tooltip from '@/src/components/Tooltip';
import Link from 'next/link';
import { useState } from 'react';

interface TransactionDetailsProps {
  fee: number | null;
}

export default function TransactionDetails({ fee }: TransactionDetailsProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  return (
    <section className="flex flex-col gap-2 ">
      <p className="c1 font-medium text-black-8">Transaction Details</p>
      <div className="flex justify-between">
        <div className="flex gap-[2px]">
          <div className="relative">
            <QuestionMartIcon
              onClick={() => setIsTooltipOpen((prev) => !prev)}
            />
            <Tooltip
              className={`whitespace-nowrap bg-[rgba(20,20,20,0.6)] rounded-lg px-3 py-[6px] text-black-1 c1 after:left-6 -translate-x-[22px] translate-y-3 ${
                isTooltipOpen ? 'opacity-100' : 'opacity-0'
              }`}
            >
              This fee is applied to ensure
              <br /> the best experience with Gimswap.
              <br />
              <Link
                className="underline underline-offset-[2.5px]"
                href="https://docs.gimswap.com/"
                target="_blank"
              >
                Learn more
              </Link>
            </Tooltip>
          </div>
          <p className="c1 font-medium text-black-8">
            GimSwap Fee ({fee ? fee?.toFixed(2) : '0.00'}%)
          </p>
        </div>
        <p className="c1 text-purple-500">Free</p>
      </div>
    </section>
  );
}
