'use client';

import ChevronUpIcon from '@/public/svg/chevron/up.svg';
import { TokenType } from '@/src/lib/types/TokenType';
import { insertComma } from '@/src/lib/utils/insertComma';
import { useState } from 'react';
import BarChart from '../../../_components/BarChart';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import { safeCalc } from '@/src/lib/utils/safeCalc';

interface BarChartAndInfoProps {
  title: string;
  totalAmount: string;
  className?: string;
  tokens: ({
    amount: string;
    value: string;
  } & Pick<TokenType, 'symbol' | 'color' | 'icon' | 'decimal'>)[];
}

export default function BarChartAndInfo({
  title,
  totalAmount,
  tokens,
  className,
}: BarChartAndInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isInActive = Math.floor(+totalAmount) <= 0;
  return (
    <section>
      <p className="p1 mb-3">{title}</p>
      <section className={`rounded-lg bg-black-3 px-4 py-3 ${className}`}>
        <div className="flex flex-row justify-between">
          <h5 className="font-bold">
            ₩ {insertComma(safeCalc.floor(totalAmount).toFixed())}
          </h5>
          <ChevronUpIcon
            className={`stroke-black-12 w-5 h-5 ${isOpen ? '' : 'rotate-180'} cursor-pointer`}
            onClick={() => setIsOpen((prev) => !prev)}
          />
        </div>
        {isOpen ? (
          <section className="pl-2 flex flex-col gap-2 mt-2">
            {tokens.map((token) => (
              <div className="flex flex-row justify-between" key={token.symbol}>
                <div className="flex flex-row gap-1">
                  <token.icon className="w-5 h-5" />
                  <p className="p1 text-black-8">{token.symbol}</p>
                </div>
                <p className="p1 font-medium text-black-12">
                  {insertComma(applyDecimals(token.value, token.decimal, 2))}
                </p>
              </div>
            ))}
          </section>
        ) : (
          <div className="w-full mt-2">
            <BarChart
              symbols={tokens.map((token) => ({
                symbol: token.symbol!,
                color: token.color!,
                percentage:
                  safeCalc.divide(token.amount, totalAmount).toNumber() || 0,
              }))}
              isInActive={isInActive}
            />
          </div>
        )}
      </section>
    </section>
  );
}
