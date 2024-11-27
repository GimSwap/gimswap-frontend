'use client';

import ExchangeIcon from '@/public/svg/exchange.svg';
import { KRWO, OPEN_VOUCHER } from '@/src/lib/constants/token';
import Image from 'next/image';

export default function BlocksAmount({ locked }: { locked: number }) {
  return (
    <section className="py-10 px-4 bg-black-13 flex flex-col items-center w-full">
      <div className="relative flex flex-col lg:flex-row gap-2 max-w-[1008px] w-full">
        <div className="rounded-2xl border border-purple-200 p-6 flex flex-col gap-1 bg-[rgba(255,255,255,0.1)] flex-1 lg:items-center">
          <p className="p1 text-black-1">Locked Open Voucher</p>
          <h3 className="font-bold text-black-1 min-h-7">
            {locked && `${(Number(locked) / 10000).toLocaleString()} OV`}
          </h3>
        </div>
        <div className="rounded-2xl border border-purple-200 p-6 flex flex-col gap-1 bg-[rgba(255,255,255,0.1)] flex-1 lg:items-center">
          <p className="p1 text-black-1">KRWO total supply</p>
          <h3 className="font-bold text-black-1 min-h-7">
            {locked && `${locked.toLocaleString()} KRWO`}
          </h3>
        </div>
        <ExchangeIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="my-4 py-4 px-6 bg-[rgba(255,255,255,0.1)] rounded-2xl flex justify-center max-w-[1008px] w-full">
        <Image
          src={OPEN_VOUCHER.imageUrl}
          width={20}
          height={20}
          alt="openvoucher"
        />
        <h5 className="text-black-1 ml-1">1 OV</h5>
        <h5 className="mx-2 text-black-1">=</h5>
        <Image src={KRWO.imageUrl} width={20} height={20} alt="KRWO" />
        <h5 className="text-black-1 ml-1">10,000 KRWO</h5>
      </div>
    </section>
  );
}
