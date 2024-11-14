'use client';

import { useState } from 'react';
import Token from '../../_components/Token';
import { OPEN_VOUCHER, KRWO } from '@/src/lib/constants/token';
import ArrowDownIcon from '@/public/svg/arrow/arrow-down.svg';
import TransactionDetails from './TransactionDetails';
import { TokenType } from '@/src/lib/types/TokenType';
import { useGetFee } from '@/src/lib/hook/useGetFee';
import { SwapButton } from './SwapButton';

export default function SwapInput() {
  const [amount, setAmount] = useState<string>('0');
  const [selectedTokens, setSelectedTokens] = useState<{
    pay: TokenType;
    receive: TokenType;
  }>({ pay: OPEN_VOUCHER, receive: KRWO });
  const [isEnoughBalance, setIsEnoughBalance] = useState<boolean>(true);

  const { fee } = useGetFee(amount);
  return (
    <>
      <section className="relative flex flex-col gap-3 mb-4">
        <Token
          type="pay"
          token={selectedTokens.pay}
          setAmount={setAmount}
          amount={amount}
          setIsEnoughBalance={setIsEnoughBalance}
          isWritable={selectedTokens.receive !== OPEN_VOUCHER}
        />
        <button
          className="p-2 bg-purple-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:hover:rotate-180 duration-200"
          onClick={() => {
            setSelectedTokens((prev) => ({
              pay: prev.receive,
              receive: prev.pay,
            }));
            setAmount('0');
          }}
        >
          <ArrowDownIcon />
        </button>
        <Token
          type="receive"
          token={selectedTokens.receive}
          amount={amount}
          setAmount={setAmount}
          isWritable={selectedTokens.receive === OPEN_VOUCHER}
        />
      </section>
      <TransactionDetails fee={fee} />
      <SwapButton
        amount={amount}
        setAmount={setAmount}
        fee={fee}
        isEnoughBalance={isEnoughBalance}
        tokens={selectedTokens}
      />
    </>
  );
}
