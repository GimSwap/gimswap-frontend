import { defaultChain, KRWO, USDT } from '@/src/lib/constants/token';
import { applyDecimals, calculateTokens } from '@/src/lib/utils/calcTick';
import { usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useFetch } from '@/src/lib/hook/useFetch';
import { fetchGetLiquidityGraphInfo } from '@/src/lib/utils/api/liquidity/fetchGetLiquidityGraphInfo';
import { useQuery } from '@tanstack/react-query';
import { fetchGetBalance } from '@/src/lib/utils/api/fetchGetBalance';
import Button from '@/src/components/Button';
import CheckAutoSwap from './CheckAutoSwap';
import { insertComma } from '@/src/lib/utils/insertComma';
import AddLiquidityInput from './AddLiquidityInput';
import Accordion from '@/src/components/Accordion';
import RangeChart from '../RangeChart';
import { SwapModeDescription } from './SwapDescription';
import { PositionType } from '@/src/lib/stores/liquidityStore/liquidityStore';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import SelectChainPopup from '@/src/components/popups/SelectChainPopup';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';

interface LiquidityInputProps {
  selectedPosition: Omit<PositionType, 'label'>;
  onButtonClick: (
    mode: 'normal' | 'auto',
    tokenAmount: { KRWO: string; USDT: string },
  ) => void;
}

export default function LiquidityInput({
  selectedPosition,
  onButtonClick,
}: LiquidityInputProps) {
  const [mode, setMode] = useState<'normal' | 'auto'>('auto');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { openPopup } = usePopupStore((state) => state);

  const { data: graphInfo } = useFetch(() =>
    fetchGetLiquidityGraphInfo({ chainId: chainId!, token: 'usdt' }),
  );

  const { address, chainId } = useAccount();

  const isUsdtDisabled = safeCalc.isGreater(
    graphInfo?.currentTick || 0,
    selectedPosition.upperTick,
  );

  const isKrwoDisabled = safeCalc.isGreater(
    selectedPosition.lowerTick,
    graphInfo?.currentTick || 0,
  );

  const { data: balance } = useQuery({
    queryKey: ['getBalance'],
    queryFn: () =>
      fetchGetBalance({
        walletAddress: address!,
        chainId: chainId! as ChainIdType,
      }),
    enabled: !!(address && chainId),
    select: (data) => data.balance,
  });

  const [tokenAmount, setTokenAmount] = useState<{
    KRWO: string;
    USDT: string;
  }>({ KRWO: '0', USDT: '0' });

  const totalAmount = safeCalc
    .add(
      tokenAmount.KRWO,
      safeCalc
        .multiply(
          tokenAmount.USDT,
          usdtTickToKrw(graphInfo?.currentTick || 0, chainId),
        )
        .toString(),
    )
    .toString();

  const buttonState = () => {
    if (!checkIsAvailableChain(chainId))
      return {
        disabled: false,
        text: 'Switch Network',
        onClick: () => openPopup(SelectChainPopup),
      };

    if (!balance?.krwo || !balance?.usdt)
      return {
        disabled: true,
        text: 'Insufficient balance',
      };

    if (
      safeCalc.isGreater(
        tokenAmount.KRWO,
        applyDecimals(balance.krwo, KRWO.decimal, 18),
      ) ||
      safeCalc.isGreater(
        tokenAmount.USDT,
        applyDecimals(
          balance.usdt,
          USDT.decimal[
            checkIsAvailableChain(chainId) ? chainId : defaultChain.id
          ],
          18,
        ),
      )
    ) {
      return {
        disabled: true,
        text: 'Insufficient balance',
      };
    }

    if (mode === 'auto') {
      const isValidKrwo =
        tokenAmount.KRWO && formatNumber(tokenAmount.KRWO) !== '0';
      const isValidUsdt =
        tokenAmount.USDT && formatNumber(tokenAmount.USDT, USDT.decimal[checkIsAvailableChain(chainId) ? chainId : defaultChain.id]) !== '0';
      const isValid = isValidKrwo || isValidUsdt;
      return {
        disabled: !isValid,
        text: isValid ? 'Add' : 'Enter amount',
        onClick: () => onButtonClick(mode, tokenAmount),
      };
    } else {
      const isValidKrwo =
        isKrwoDisabled || (tokenAmount.KRWO && tokenAmount.KRWO !== '0');
      const isValidUsdt =
        isUsdtDisabled || (tokenAmount.USDT && tokenAmount.USDT !== '0');

      const isValid = isValidKrwo && isValidUsdt;
      return {
        disabled: !isValid,
        text: isValid ? 'Add' : 'Enter amount',
        onClick: () => onButtonClick(mode, tokenAmount),
      };
    }
  };

  const handleTokenAmount = (token: string, value: string) => {
    if (isNaN(+value)) return;
    if (!graphInfo || !selectedPosition) return;
    if (value.includes('.') && value.split('.')[1].length > 18) return;
    const sanitizedValue = value.replace(/^0+(?=\d)/, '').replace(/^\./, '0.');

    const isUsdtInput = token === 'USDT';

    if (mode === 'auto') {
      setTokenAmount((prev) => ({ ...prev, [token]: sanitizedValue }));
    } else {
      if (isUsdtDisabled) {
        setTokenAmount({
          KRWO: sanitizedValue,
          USDT: '0',
        });
        return;
      }

      if (isKrwoDisabled) {
        setTokenAmount({
          KRWO: '0',
          USDT: sanitizedValue,
        });
        return;
      }

      const newInputValues = calculateTokens(
        isUsdtInput ? tokenAmount.KRWO : sanitizedValue,
        isUsdtInput ? sanitizedValue : tokenAmount.USDT,
        isUsdtInput,
        graphInfo?.currentTick,
        selectedPosition!.lowerTick,
        selectedPosition!.upperTick,
        chainId,
      );
      setTokenAmount({
        KRWO: isUsdtInput
          ? formatNumber(newInputValues?.newKrwoInput!)
          : sanitizedValue,
        USDT: isUsdtInput
          ? sanitizedValue
          : formatNumber(newInputValues?.newUsdtInput!),
      });
    }
  };

  useEffect(() => {
    setTokenAmount({ KRWO: '0', USDT: '0' });
  }, [mode, selectedPosition]);

  return (
    <>
      <section className="flex flex-col gap-3 my-3 max-lg:max-h-[calc(100dvh_-_210px)] overflow-y-scroll overflow-x-hidden scrollbar-hide">
        <RangeChart
          selectedPosition={selectedPosition!}
          graphInfo={graphInfo}
        />
        <p className="p1">Enter Amount</p>
        <Accordion
          title={SwapModeDescription[mode].title}
          className={`rounded-lg px-4 pb-2 overflow-visible ${SwapModeDescription[mode].backgroundColor}`}
          titleClassName="!mb-0 pt-1"
          chevronClassName={SwapModeDescription[mode].chevronColor}
        >
          {SwapModeDescription[mode].description}
        </Accordion>
        <AddLiquidityInput
          token={{
            ...KRWO,
            icon: KRWO.icon[
              checkIsAvailableChain(chainId) ? chainId : defaultChain.id
            ],
          }}
          value={tokenAmount.KRWO}
          krwValue={tokenAmount.KRWO}
          focusedInput={focusedInput}
          setFocusedInput={setFocusedInput}
          balance={balance?.krwo || '0'}
          onChange={handleTokenAmount}
          disabled={mode !== 'auto' && isKrwoDisabled}
          disablePlaceHolder="USDT Only"
        />
        <AddLiquidityInput
          token={USDT}
          value={tokenAmount.USDT}
          krwValue={safeCalc
            .multiply(
              tokenAmount.USDT,
              usdtTickToKrw(graphInfo?.currentTick || 0, chainId),
            )
            .toString()}
          focusedInput={focusedInput}
          setFocusedInput={setFocusedInput}
          balance={balance?.usdt || '0'}
          onChange={handleTokenAmount}
          disabled={mode !== 'auto' && isUsdtDisabled}
          disablePlaceHolder="KRWO Only"
        />
        <div>
          <div className="flex flex-row justify-between py-1">
            <p className="c1">Total Liquidity</p>
            <p className="c1 font-bold">
              ₩ {insertComma(formatNumber(totalAmount, 2))}
            </p>
          </div>
          {mode === 'auto' && (
            <p className="c1 py-1 text-black-8">
              ㄴFee is charged for Auto Swap
            </p>
          )}
        </div>
      </section>
      <CheckAutoSwap mode={mode} setMode={setMode} />
      <Button
        className="w-full rounded-lg text-black-1 text-h4 font-bold py-[14px] px-6 mt-4 mb-5"
        size="xl"
        color="primary"
        onClick={buttonState().onClick}
        disabled={buttonState().disabled}
      >
        {buttonState().text}
      </Button>
    </>
  );
}
