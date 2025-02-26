import Accordion from '@/src/components/Accordion';
import QuestionIcon from '@/public/svg/filled-question.svg';
import { useEffect, useState } from 'react';
import BuyOVFAQ from './BuyOVFAQ';
import TransferButtons from './TransferButtons';
import { PaginationPushType } from '@/src/components/popups/PopupPagination';
import { useAccount } from 'wagmi';
import { useQueries } from '@tanstack/react-query';
import { fetchGetQuote } from '@/src/lib/utils/api/swift/fetchGetQuote';
import { bsc } from 'wagmi/chains';
import { KRWO, USDT } from '@/src/lib/constants/token';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { applyDecimals, calcKrwPrice } from '@/src/lib/utils/calcTick';
import { useDebounce } from '@/src/lib/hook/useDebounce';
import { useTranslations } from 'next-intl';
import ChevronRightIcon from '@/public/svg/chevron/curved-right.svg';
import Chip from '@/src/components/Chip';
import ExclamationIcon from '@/public/svg/circle-excalmation.svg';
import { fetchGetCurrentTick } from '@/src/lib/utils/api/liquidity/fetchGetCurrentTick';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { insertComma } from '@/src/lib/utils/insertComma';
import { useGetCurrentWallet } from '@/src/lib/hook/useGetCurrentWallet';
import { useRouter } from '@/src/i18n/routing';
import { fetchGetBalance } from '@/src/lib/utils/api/fetchGetBalance';

const MAX_AMOUNT = 1000000000000;

interface BuyOvProps {
  next: PaginationPushType;
}

export default function BuyOv({ next }: BuyOvProps) {
  const t = useTranslations('quickDeposit.buyOv');
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const debouncedAmount = useDebounce(amount, 500);

  const { data: currentWallet } = useGetCurrentWallet();
  const { address, isConnected } = useAccount();

  const handleAmount = (value: string) => {
    if (isNaN(+value)) return;
    setAmount(+value > MAX_AMOUNT ? MAX_AMOUNT : +value);
  };

  const ceilAmount = (amount: number) => {
    return Math.ceil(+amount / 10000) * 10000;
  };

  const [{ data: quote }, { data: usdtTick }, { data: balance }] = useQueries({
    queries: [
      {
        queryKey: ['quote', debouncedAmount, address],
        queryFn: () =>
          fetchGetQuote({
            chainId: bsc.id,
            tokenOut: USDT.contractAddress[bsc.id],
            recipient: address as `0x${string}`,
            amountIn: safeCalc
              .multiply(
                Math.ceil(debouncedAmount / 10000) * 10000,
                10 ** KRWO.decimal,
              )
              .toString(),
          }),
        enabled: !!address && debouncedAmount >= 10000,
      },
      {
        queryKey: ['getUsdtTick', bsc.id],
        queryFn: () =>
          fetchGetCurrentTick({
            chainId: bsc.id,
            token: 'usdt',
          }),
        refetchInterval: 10000,
      },
      {
        queryKey: ['balance', address, bsc.id],
        queryFn: () =>
          fetchGetBalance({
            walletAddress: address as `0x${string}`,
            chainId: bsc.id,
          }),
        enabled: !!address && !!bsc.id,
      },
    ],
  });

  const usdtPrice = safeCalc
    .multiply(
      calcKrwPrice(
        bsc.id,
        usdtTick?.currentTick,
        '1',
        USDT.decimal[bsc.id],
        'usdt',
      ),
      10 ** USDT.decimal[bsc.id],
    )
    .toString();

  useEffect(() => {
    if (
      !isConnected ||
      (currentWallet &&
        !currentWallet.id.toLocaleLowerCase().includes('binance'))
    ) {
      router.push('/quick-deposit');
    }
  }, [currentWallet]);
  return (
    <>
      <section className="max-h-[calc(100dvh-100px)] min-h-[calc(100dvh-100px)] pb-[100px] scrollbar-hide overflow-y-auto">
        <h4 className="font-bold pb-2 px-6">
          {t.rich('title', {
            br: () => <br />,
          })}
        </h4>
        <p className="text-black-8 pb-2 px-6">{t('subTitle')}</p>
        <section className="pt-4 flex flex-col gap-6 px-6">
          <section className="p-4 rounded-lg bg-black-3 flex flex-col gap-4">
            <section className="flex flex-col gap-2">
              <section className="flex flex-row justify-between">
                <h5 className="text-black-8 ">{t('sendAmount')}</h5>
                <input
                  type="tel"
                  placeholder={t('inputPlaceholder')}
                  value={amount ? `₩ ${amount.toLocaleString()}` : ''}
                  onBlur={() => setAmount(ceilAmount(amount))}
                  onChange={(e) =>
                    handleAmount(e.target.value.replace(/₩|\s|,/g, ''))
                  }
                  className="text-h5 placeholder:font-bold placeholder:text-black-6 font-bold flex-1 text-end"
                />
              </section>
              <p className="c1 text-end text-black-8">{t('inputUnit')}</p>
            </section>
            <hr className="border-black-5" />
            <section className="flex flex-row justify-between">
              <div className="flex flex-row gap-1 items-center">
                <ChevronRightIcon className="w-4 h-4" />
                <p className="text-black-8 p1">{t('buyOv')}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <p className="p1 font-medium text-black-8 pl-2">
                  {Math.ceil(amount / 10000)} OV
                </p>
              </div>
            </section>
          </section>
          <section className="flex flex-row justify-between">
            <div className="flex flex-row gap-1 items-center">
              <p className="p1 font-medium text-black-8">
                {t('estimatedDepositAmount')}
              </p>
              <Chip color="lightPurple" className="!c1">
                {t('maybe')}
              </Chip>
            </div>
            <p className="p1 font-medium">
              {quote?.amountOut
                ? t('usdtAmount', {
                    amount: applyDecimals(
                      quote.amountOut,
                      USDT.decimal[bsc.id],
                    ),
                  })
                : 0}
            </p>
          </section>
        </section>
        <section className="px-6 pb-8">
          <hr className="text-black-4 my-4" />
          <section className="flex flex-row justify-between">
            <div className="flex flex-row gap-2 items-center">
              <ExclamationIcon className="w-4 h-4" />
              <p className="c1 text-black-8">{t('currentUSDTPrice')}</p>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <USDT.icon className="w-4 h-4" />
              <p className="c1 text-black-8">
                1 USDT = ₩ {insertComma(formatNumber(usdtPrice, 0))}
              </p>
            </div>
          </section>
        </section>
        <hr className="h-[8px] border-black-3 bg-black-3" />
        <Accordion
          title={
            <div className="flex flex-row gap-1">
              <QuestionIcon className="w-6 h-6" />
              <h5 className="font-medium text-black-8">{t('buyOvFAQ')}</h5>
            </div>
          }
          className="pt-6"
          titleClassName="px-6 pb-4"
        >
          <BuyOVFAQ />
        </Accordion>
      </section>
      <TransferButtons
        next={next}
        amount={ceilAmount(debouncedAmount)}
        OVBalance={balance?.balance.ov}
        usdtPrice={usdtPrice}
      />
    </>
  );
}
