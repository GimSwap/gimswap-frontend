'use client';

import ChevronUpIcon from '@/public/svg/chevron/up.svg';
import { TokenType } from '@/src/lib/types/TokenType';
import { insertComma } from '@/src/lib/utils/insertComma';
import { useState } from 'react';
import BarChart from '../../../_components/BarChart';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { useAccount } from 'wagmi';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { defaultChain } from '@/src/lib/constants/token';

interface BarChartAndInfoProps {
  title: string;
  subTitle?: string;
  className?: string;
  tokens: ({
    amount: string;
    value: string;
    color: string;
    precision?: number;
  } & Pick<TokenType, 'icon' | 'decimal' | 'symbol'>)[];
  symbolStyle?: {
    showPercentage?: boolean;
    className?: string;
  };
}

export default function BarChartAndInfo({
  title,
  subTitle,
  tokens,
  className,
  symbolStyle,
}: BarChartAndInfoProps) {
  const { chainId } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const totalAmount = tokens.reduce((acc, token) => {
    return safeCalc.add(acc, token.amount).toString();
  }, '0');
  const isInActive = Math.floor(+totalAmount) <= 0;
  return (
    <section>
      <p className="p1 mb-3">{title}</p>
      <section className={`rounded-lg bg-black-3 px-4 py-3 ${className}`}>
        <div className="flex flex-row justify-between">
          <p className="p1 text-black-8">
            {subTitle}
            <span className="font-bold">
              ₩ {insertComma(safeCalc.floor(totalAmount).toFixed())}
            </span>
          </p>
          <ChevronUpIcon
            className={`stroke-black-12 w-5 h-5 ${isOpen ? '' : 'rotate-180'} cursor-pointer`}
            onClick={() => setIsOpen((prev) => !prev)}
          />
        </div>
        {isOpen ? (
          <section className="pl-2 flex flex-col gap-2 mt-2">
            {tokens.map((token, index) => {
              const Icon =
                typeof token.icon === 'object'
                  ? token.icon[
                      checkIsAvailableChain(chainId) ? chainId : defaultChain.id
                    ]
                  : token.icon;
              const decimal =
                typeof token.decimal === 'object'
                  ? token.decimal[
                      checkIsAvailableChain(chainId) ? chainId : defaultChain.id
                    ]
                  : token.decimal;
              return (
                <div
                  className="flex flex-row justify-between"
                  key={token.symbol + index}
                >
                  <div className="flex flex-row gap-1">
                    <Icon className="w-5 h-5" />
                    <p className="p1 text-black-8">{token.symbol}</p>
                  </div>
                  <p className="p1 font-medium text-black-12">
                    {isInActive
                      ? '-'
                      : insertComma(applyDecimals(token.value, decimal, token.precision || 2 ))}
                  </p>
                </div>
              );
            })}
          </section>
        ) : (
          <div className="w-full mt-2">
            <BarChart
              symbols={tokens.map((token) => {
                return {
                  symbol: token.symbol!,
                  color: token.color,
                  percentage:
                    safeCalc.divide(token.amount, totalAmount).toNumber() || 0,
                };
              })}
              isInActive={isInActive}
              symbolStyle={symbolStyle}
            />
          </div>
        )}
      </section>
    </section>
  );
}
