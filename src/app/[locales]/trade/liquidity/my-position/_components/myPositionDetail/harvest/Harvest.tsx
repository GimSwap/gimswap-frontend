'use client';

import { defaultChain, KRWO, TOKEN_MAP, USDT } from '@/src/lib/constants/token';
import BarChartAndInfo from '../BarChartAndInfo';
import Chip from '@/src/components/Chip';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import CollectReviewPopup from './CollectReviewPopup';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import { useAccount } from 'wagmi';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';

interface TokenProps {
  value: string;
  amount: string;
}

interface HarvestProps {
  krwo: TokenProps;
  usdt: TokenProps;
  native: TokenProps;
  tokenId: number;
}

export default function Harvest({ krwo, usdt, native, tokenId }: HarvestProps) {
  const { openPopup } = usePopupStore((state) => state);
  const { chainId } = useAccount();
  const totalAmount = safeCalc
    .add(safeCalc.add(krwo.amount, usdt.amount).toString(), native.amount)
    .toString();
  const isInActive = Math.floor(+totalAmount) <= 0;

  const _chainId = checkIsAvailableChain(chainId) ? chainId : defaultChain.id;
  const defaultTokens = [
    {
      ...KRWO,
      value: krwo.value,
      amount: krwo.amount,
      icon: KRWO.icon[_chainId],
      color: KRWO.color[_chainId],
    },
    {
      ...USDT,
      value: usdt.value,
      amount: usdt.amount,
    },
  ];

  const tokens = TOKEN_MAP[_chainId].native.supportFarming
    ? [
        ...defaultTokens,
        {
          ...TOKEN_MAP[
            checkIsAvailableChain(chainId) ? chainId : defaultChain.id
          ].reward,
          value: native.value,
          amount: native.amount,
        },
      ]
    : defaultTokens;

  const defaultFees = [
    {
      ...KRWO,
      amount: applyDecimals(krwo.value, KRWO.decimal, 10),
    },
    {
      ...USDT,
      amount: applyDecimals(
        usdt.value,
        USDT.decimal[
          checkIsAvailableChain(chainId) ? chainId : defaultChain.id
          ],
        10,
      ),
    },
  ]

  const fees = TOKEN_MAP[_chainId].native.supportFarming
    ? [
      ...defaultFees,
      {
        ...TOKEN_MAP[
          checkIsAvailableChain(chainId) ? chainId : defaultChain.id
          ].reward,
        amount: applyDecimals(
          native.value,
          TOKEN_MAP[
            checkIsAvailableChain(chainId) ? chainId : defaultChain.id
            ].native.decimal,
          10,
        ),
      },
  ] : defaultFees;

  return (
    <div>
      <BarChartAndInfo
        title={
          TOKEN_MAP[checkIsAvailableChain(chainId) ? chainId : defaultChain.id]
            .native.supportFarming
            ? 'Fee & Harvest'
            : 'Fee'
        }
        className="rounded-b-none"
        tokens={tokens}
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
              tokens: fees,
            })
          }
        >
          Collect
        </Chip>
      </section>
    </div>
  );
}
