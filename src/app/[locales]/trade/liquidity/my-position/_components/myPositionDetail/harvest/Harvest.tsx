'use client';

import { KLAYTN, KRWO, USDT } from '@/src/lib/constants/token';
import BarChartAndInfo from '../BarChartAndInfo';
import Chip from '@/src/components/Chip';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import CollectReviewPopup from './CollectReviewPopup';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { applyDecimals } from '@/src/lib/utils/calcTick';

interface TokenProps {
  value: string;
  amount: string;
}

interface HarvestProps {
  krwo: TokenProps;
  usdt: TokenProps;
  kaia: TokenProps;
  tokenId: number;
}

export default function Harvest({ krwo, usdt, kaia, tokenId }: HarvestProps) {
  const { openPopup } = usePopupStore((state) => state);
  const totalAmount = safeCalc
    .add(safeCalc.add(krwo.amount, usdt.amount).toString(), kaia.amount)
    .toString();
  const isInActive = Math.floor(+totalAmount) <= 0;

  return (
    <div>
      <BarChartAndInfo
        title="Fee & Harvest"
        totalAmount={totalAmount}
        className="rounded-b-none"
        tokens={[
          {
            ...KRWO,
            value: krwo.value,
            amount: krwo.amount,
          },
          {
            ...USDT,
            value: usdt.value,
            amount: usdt.amount,
          },
          {
            ...KLAYTN,
            value: kaia.value,
            amount: kaia.amount,
          },
        ]}
      />
      <section className="bg-black-3 px-4 pb-3 pt-2 rounded-b-lg">
        <Chip
          color={isInActive ? 'lightGray' : 'black'}
          className={`py-[6px] px-3 cursor-pointer ${
            isInActive ? 'bg-black-5' : 'bg-black-12'
          }`}
          disabled={isInActive}
          onClick={() =>
            openPopup(CollectReviewPopup, {
              tokenId,
              totalAmount,
              tokens: [
                {
                  ...KRWO,
                  amount: applyDecimals(krwo.value, KRWO.decimal, 10),
                },
                {
                  ...USDT,
                  amount: applyDecimals(usdt.value, USDT.decimal, 10),
                },
                {
                  ...KLAYTN,
                  amount: applyDecimals(kaia.value, KLAYTN.decimal, 10),
                },
              ],
            })
          }
        >
          Collect
        </Chip>
      </section>
    </div>
  );
}
