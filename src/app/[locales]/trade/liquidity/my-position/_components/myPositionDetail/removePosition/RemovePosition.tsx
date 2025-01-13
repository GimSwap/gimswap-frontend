import ChevronLeftIcon from '@/public/svg/chevron/left.svg';
import BarChart from '../../../../_components/BarChart';
import RemoveSlider from './RemoveSlider';
import { useState } from 'react';
import { TokenType } from '@/src/lib/types/TokenType';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { insertComma } from '@/src/lib/utils/insertComma';
import Lottie from 'lottie-react';
import bellLottie from '@/public/lottie/bell-26-purple.json';
import Button from '@/src/components/Button';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import RemovePositionReviewPopup from './RemovePositionReviewPopup';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { MyPositionType } from '@/src/lib/types/api/liquidity/GetPositionType';
import { KRWO, USDT } from '@/src/lib/constants/token';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import { useAccount } from 'wagmi';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import useSwitchNetwork from '@/src/lib/hook/useSwitchNetwork';

interface RemovePositionProps {
  prev: () => void;
  tokens: ({
    amount: string;
  } & Pick<TokenType, 'symbol' | 'color' | 'icon'>)[];
  totalAmount: string;
  selectedMyPosition: MyPositionType;
  fees: (Pick<TokenType, 'symbol' | 'color' | 'icon' | 'decimal'> & {
    amount: string;
    value: string;
  })[];
  totalLiquidity: string;
}

export default function RemovePosition({
  prev,
  tokens,
  totalAmount,
  selectedMyPosition,
  fees,
  totalLiquidity,
}: RemovePositionProps) {
  const [value, setValue] = useState('');
  const [tokenAmount, setTokenAmount] = useState({
    krwoAmount: '0',
    usdtAmount: '0',
  });

  const { chainId } = useAccount();
  const { switchChain } = useSwitchNetwork();
  const { openPopup } = usePopupStore((state) => state);
  const { currentPrice } = useLiquidityStore((state) => state);

  const totalFee = fees.reduce(
    (acc, fee) => safeCalc.add(acc, fee.amount).toString(),
    '0',
  );

  const handleInput = (value: string) => {
    if (isNaN(+value)) return;
    if (safeCalc.isGreaterOrEqual(value, totalAmount)) {
      setValue(totalAmount);
      handleTokenAmount(totalAmount);
    } else {
      setValue(value);
      handleTokenAmount(value);
    }
  };
  const handleTokenAmount = (amount: string) => {
    const percentage = safeCalc.divide(amount, totalAmount).toString();
    setTokenAmount({
      krwoAmount: applyDecimals(
        safeCalc.multiply(tokens[0].amount, +percentage).toString(),
      ),
      usdtAmount: applyDecimals(
        safeCalc.multiply(tokens[1].amount, +percentage).toString(),
      ),
    });
  };

  const handleOpenRemovePositionReviewPopup = () => {
    openPopup(RemovePositionReviewPopup, {
      tokenId: selectedMyPosition.tokenId,
      feeAndHarvestTokens: fees,
      totalAmount,
      totalRemovingAmount: value,
      totalLiquidity: safeCalc
        .multiply(
          totalLiquidity,
          safeCalc.divide(value, totalAmount).toString(),
        )
        .toString(),
      removingTokens: [
        {
          ...KRWO,
          amount: formatNumber(tokenAmount.krwoAmount, 0),
        },
        {
          ...USDT,
          amount: formatNumber(tokenAmount.usdtAmount, 2),
        },
      ],
    });
  };

  const buttonState = () => {
    if (!checkIsAvailableChain(chainId)) {
      return {
        disabled: false,
        text: 'Switch Network',
        onClick: async () => await switchChain(),
      };
    }

    if (!value || value === '0') {
      return {
        disabled: true,
        text: 'Enter an amount',
      };
    }
    return {
      disabled: false,
      text: 'Remove',
      onClick: handleOpenRemovePositionReviewPopup,
    };
  };

  return (
    <section>
      <div className="flex flex-row gap-1 items-center mb-1">
        <ChevronLeftIcon className="w-6 h-6 stroke-black-12" onClick={prev} />
        <h3 className="font-bold">Remove</h3>
      </div>
      <div className="max-h-[calc(95dvh-124px)] overflow-y-scroll overflow-x-hidden scrollbar-hide pb-[124px]">
        <section className="flex flex-col gap-3 my-3 max-lg:max-h-[calc(100dvh-210px)] overflow-y-scroll overflow-x-hidden scrollbar-hide w-full">
          <section className="bg-black-3 py-3 px-4 rounded-lg mb-1">
            <div className="pb-2 flex flex-row justify-between">
              <p className="p1">My Liquidity</p>
              <p className="p1 font-bold">
                ₩ {insertComma(formatNumber(totalAmount, 0))}
              </p>
            </div>
            <BarChart
              symbols={[
                {
                  symbol: 'KRWO',
                  percentage: safeCalc
                    .divide(applyDecimals(tokens[0].amount, 6, 10), totalAmount)
                    .toNumber(),
                  color: '#BFF009',
                },
                {
                  symbol: 'USDT',
                  percentage: safeCalc
                    .divide(
                      safeCalc
                        .multiply(
                          currentPrice,
                          applyDecimals(tokens[1].amount, 6, 10),
                        )
                        .toString(),
                      totalAmount,
                    )
                    .toNumber(),
                  color: '#50AF95',
                },
              ]}
            />
          </section>
        </section>
        <p className="p1">Enter Amount</p>
        <section className="rounded-lg black-3 p-4 pb-6 flex flex-col bg-black-3">
          <p className="c1 font-medium pb-4">You remove</p>
          <input
            type="text"
            value={value ? `₩ ${insertComma(formatNumber(value, 0))}` : ''}
            onChange={(e) => handleInput(e.target.value.replace(/₩|\s|,/g, ''))}
            className="placeholder:h2 placeholder:font-bold placeholder:text-black-6 text-h2 font-bold relative before:content-['₩'] before:absolute before:left-0 before:top-0 before:text-h2 before:font-bold before:text-black-12 pb-2"
            placeholder="Enter an amount"
          />
          <section className="flex flex-col gap-2 mb-4">
            {tokens.map((token) => (
              <div className="flex flex-row justify-between" key={token.symbol}>
                <div className="flex flex-row gap-1">
                  <token.icon className="w-5 h-5" />
                  <p className="p1 text-black-8">{token.symbol}</p>
                </div>
                <p className="c1">
                  {token.symbol === 'KRWO'
                    ? insertComma(formatNumber(tokenAmount.krwoAmount, 2))
                    : insertComma(formatNumber(tokenAmount.usdtAmount, 2))}
                </p>
              </div>
            ))}
          </section>
          <RemoveSlider
            value={value}
            setValue={handleInput}
            totalAmount={totalAmount}
          />
        </section>
        <section className="pt-4 flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <p className="c1">Total Received</p>
            <p className="c1 font-bold">
              ₩{' '}
              {insertComma(
                formatNumber(safeCalc.add(value, totalFee).toString(), 0),
              )}
            </p>
          </div>
          <div className="flex flex-row justify-between pl-2">
            <p className="c1 text-black-8">Removing Liquidity</p>
            <p className="c1 font-medium">
              ₩ {insertComma(formatNumber(value, 0)) || 0}
            </p>
          </div>
          <div className="flex flex-row justify-between pl-2">
            <p className="c1 text-black-8">Fee & Harvest</p>
            <p className="c1 font-medium">
              ₩ {insertComma(formatNumber(totalFee, 0))}
            </p>
          </div>
          <hr className="border-black-4" />
          <div className="flex flex-row justify-between">
            <p className="c1">Remaining Liquidity</p>
            <p className="c1 font-bold">
              {`₩ ${insertComma(
                safeCalc.subtract(totalAmount, value).floor().toString(),
              )}`}
            </p>
          </div>
        </section>
      </div>
      <section className="pt-2 pb-5 flex flex-col bg-black-1 absolute bottom-0 w-full">
        <div className="flex flex-row items-center pb-4 justify-center">
          <Lottie
            animationData={bellLottie}
            loop={true}
            autoplay={true}
            className="w-[26px] h-[26px]"
          />
          <h5 className="font-medium text-purple-500">
            Removing will receive Fee & Harvest
          </h5>
        </div>
        <Button
          size="xl"
          color="primary"
          disabled={buttonState().disabled}
          onClick={buttonState().onClick}
        >
          {buttonState().text}
        </Button>
      </section>
    </section>
  );
}
