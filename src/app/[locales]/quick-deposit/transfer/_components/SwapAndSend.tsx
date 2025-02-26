import { useTranslations } from 'next-intl';
import { KRWO, OPEN_VOUCHER, USDT } from '@/src/lib/constants/token';
import ArrowDownIcon from '@/public/svg/arrow/arrow-down-resizable.svg';
import QuestionIcon from '@/public/svg/circle-question.svg';
import FilledQuestionIcon from '@/public/svg/filled-question.svg';
import ExclamationCircleIcon from '@/public/svg/circle-excalmation.svg';
import Accordion from '@/src/components/Accordion';
import SwapAndSendButtons from './SwapAndSendButtons';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { insertComma } from '@/src/lib/utils/insertComma';
import { useQueries } from '@tanstack/react-query';
import { fetchGetQuote } from '@/src/lib/utils/api/swift/fetchGetQuote';
import { bsc } from 'viem/chains';
import { useAccount } from 'wagmi';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import { fetchGetFee } from '@/src/lib/utils/api/swift/fetchGetFee';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import RefreshUsdt from './RefreshUsdt';

interface SwapAndSendProps {
  OVAmount: string;
  prev: () => void;
  usdtPrice: string;
}

export default function SwapAndSend({
  OVAmount,
  prev,
  usdtPrice,
}: SwapAndSendProps) {
  const t = useTranslations('quickDeposit.swapAndSend');

  const KRWOIcon = KRWO.icon[56];
  const { address } = useAccount();

  const [{ data: fee }, { data: quote, refetch: refetchQuote }] = useQueries({
    queries: [
      {
        queryKey: ['fee'],
        queryFn: () => fetchGetFee({ chainId: bsc.id }),
      },
      {
        queryKey: ['quote', OVAmount, address],
        queryFn: () =>
          fetchGetQuote({
            chainId: bsc.id,
            tokenOut: USDT.contractAddress[bsc.id],
            recipient: address as `0x${string}`,
            amountIn: safeCalc
              .multiply(OVAmount, 10 ** OPEN_VOUCHER.decimal)
              .toString(),
          }),
        refetchInterval: 10000,
      },
    ],
  });
  const usdtAmount = quote
    ? applyDecimals(quote.amountOut, USDT.decimal[bsc.id])
    : '0';

  return (
    <>
      <section className="max-h-[calc(100dvh-100px)] min-h-[calc(100dvh-100px)] pb-[100px] overflow-y-auto scrollbar-hide">
        <section className="px-6 flex flex-col gap-4 pb-8">
          <div>
            <h4 className="font-bold pb-2">
              {t.rich('title', {
                br: () => <br />,
              })}
            </h4>
            <p className="text-black-8 pb-2">{t('subTitle')}</p>
          </div>
          <section className="p-4 rounded-lg bg-black-3 flex flex-col gap-4">
            <section className="flex flex-col gap-2">
              <section className="flex flex-row justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <OPEN_VOUCHER.icon className="w-6 h-6" />
                  <h5 className="text-black-8">OV</h5>
                </div>
                <h5 className="font-bold">{insertComma(OVAmount)}</h5>
              </section>
              <p className="c1 text-end text-black-8">
                ₩ {insertComma(safeCalc.multiply(OVAmount, 10000).toString())}
              </p>
              <div className="relative w-full h-[36px] flex items-center">
                <hr className="border-black-5 w-full" />
                <div className="bg-black-5 rounded-full w-9 h-[36px] grid place-items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <ArrowDownIcon className="stroke-black-1 w-[22px] h-[22px]" />
                </div>
              </div>
              <section className="flex flex-row justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <USDT.icon className="w-6 h-6" />
                  <h5 className="text-black-8">USDT</h5>
                </div>
                <h5 className="font-bold">{insertComma(usdtAmount)}</h5>
              </section>
              <section className="flex flex-row justify-between">
                <p className="c1 text-black-8 px-2 py-1 rounded-full bg-black-4">
                  {`1 USDT = ${formatNumber(usdtPrice, 0)} KRW`}
                </p>
                <p className="c1 text-end text-black-8">
                  ₩{' '}
                  {formatNumber(
                    insertComma(
                      safeCalc.multiply(usdtAmount, usdtPrice).toString(),
                    ),
                    0,
                  )}
                </p>
              </section>
            </section>
          </section>
          <section className="flex flex-row justify-between">
            <div className="flex flex-row gap-1 items-center">
              <p className="p1 font-medium text-black-8">{t('fee')}</p>
              <QuestionIcon />
            </div>
            <p className="p1 font-medium">
              ₩ {fee ? applyDecimals(fee.amount, KRWO.decimal, 0) : '0'}
            </p>
          </section>
          <section className="flex flex-row justify-between">
            <p className="p1 font-medium text-black-8">
              {t('estimatedDepositAmount')}
            </p>
            <div className="flex flex-row gap-1 items-center">
              <p className="p1 font-medium">
                {t('estimatedAmount', { amount: insertComma(usdtAmount) })}
              </p>
              <RefreshUsdt />
            </div>
          </section>
          <hr className="border-black-4" />
          <section className="flex flex-col gap-2">
            <div className="flex flex-row gap-1 items-center">
              <QuestionIcon />
              <p className="c1 text-black-8">{t('feeDescription1')}</p>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <ExclamationCircleIcon />
              <p className="c1 text-black-8">{t('feeDescription2')}</p>
            </div>
            <section className="px-4 py-1 flex flex-row gap-1 items-center">
              <OPEN_VOUCHER.icon className="min-w-4 w-4 h-4" />
              <ArrowDownIcon className="stroke-black-5 -rotate-90 w-4 h-4" />
              <KRWOIcon className="w-4 h-4" />
              <ArrowDownIcon className="stroke-black-5 -rotate-90 w-4 h-4" />
              <USDT.icon className="w-4 h-4" />
              <p className="c1 text-black-8">
                {t('usdtAmount', { amount: insertComma(usdtAmount) })}
              </p>
            </section>
          </section>
        </section>
        <hr className="h-[8px] bg-black-3 w-full border-black-3" />
        <Accordion
          title={
            <div className="flex flex-row gap-1 items-center">
              <FilledQuestionIcon className="w-6 h-6" />
              <h5 className="text-h5 font-medium text-black-8">
                {t('feeFAQ')}
              </h5>
            </div>
          }
          titleClassName="px-6 pb-4 pt-6"
        >
          <p className="p1 p-6 bg-black-3 text-black-8">
            {t('feeFAQDescription')}
          </p>
        </Accordion>
      </section>
      <SwapAndSendButtons
        usdtAmount={insertComma(usdtAmount)}
        OVAmount={OVAmount}
        prev={prev}
        quote={quote}
        refetchQuote={refetchQuote}
      />
    </>
  );
}
