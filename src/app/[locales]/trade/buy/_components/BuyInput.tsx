'use client';

import { useState } from 'react';
import OpenVoucherIcon from '@/public/svg/token/open-voucher.svg';
import KrFlagIcon from '@/public/svg/token/kr-flag.svg';
import Button from '@/src/components/Button';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { useAccount } from 'wagmi';

const OPEN_VOUCHER_UNIT = 10000;

export default function BuyInput() {
  const [amount, setAmount] = useState<string>('1');
  const { address, isConnected } = useAccount();
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(e.target.value))) return;
    setAmount(e.target.value);
  };

  const handleOpenVoucherPayment = (url: string) => {
    window.open(url, 'openvoucherPayment', 'popup=true,width=380,height=780');
  };

  return (
    <section className="flex flex-col gap-3">
      <section className="rounded-lg bg-black-3 px-4 py-6">
        <section className="flex justify-between pb-1 cursor-pointer">
          <p className="c1 font-medium">You pay</p>
          <div className="py-[6px] px-2 bg-black-1 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex gap-1 items-center">
            <KrFlagIcon />
            <p className="c1 font-medium">KRW</p>
          </div>
        </section>
        <div className="mb-[2px]">
          <input
            type="tel"
            disabled
            value={safeCalc.multiply(amount, OPEN_VOUCHER_UNIT).toFixed()}
            inputMode="numeric"
            placeholder="0"
            className="font-bold text-h2 w-full placeholder-black-6 text-black-6"
          />
        </div>
      </section>
      <section className="rounded-lg bg-black-3 p-4 border border-purple-500">
        <section className="flex justify-between pb-1 cursor-pointer">
          <p className="c1 font-medium">You receive</p>
          <div className="py-[6px] px-2 bg-black-1 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex gap-1 items-center">
            <OpenVoucherIcon />
            <p className="c1 font-medium">OPEN VOUCHER</p>
          </div>
        </section>
        <div className="mb-[2px]">
          <input
            type="tel"
            value={amount}
            inputMode="numeric"
            placeholder="0"
            onChange={handleAmountChange}
            className="font-bold text-h2 w-full"
          />
        </div>
      </section>
      <Button
        title="Buy"
        onClick={() =>
          handleOpenVoucherPayment(
            `${process.env.NEXT_PUBLIC_OPEN_VOUCHER_URL}/payment/buy?amount=${amount}&method=purchase&address=${address}`,
          )
        }
        disabled={+amount <= 0 || !isConnected}
        className="bg-purple-500 text-black-1 mt-6 mb-4"
      />
      <button
        className="c1 font-medium text-black-8 underline underline-offset-[3px] text-center"
        onClick={() =>
          handleOpenVoucherPayment(
            `${process.env.NEXT_PUBLIC_OPEN_VOUCHER_URL}/payment/transactions?method=history&wallet=${address}`,
          )
        }
      >
        View History
      </button>
    </section>
  );
}
