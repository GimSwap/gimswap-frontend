'use client';

import { defaultChain, KRWO } from '@/src/lib/constants/token';
import { useEffect, useState } from 'react';
import SwapTokenBox from './_components/swapTokenBox/SwapTokenBox';
import { useAccount } from 'wagmi';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import ArrowDownIcon from '@/public/svg/arrow/arrow-down.svg';
import ChevronDownIcon from '@/public/svg/chevron/down.svg';
import Button from '@/src/components/Button';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SwapRoutesPopup from './_components/SwapRoutesPopup';
import { classifyToken, switchTokenOrder } from './_utils';
import {
  useGetButtonState,
  useHandleSwap,
  useGetReceiveTokenText,
} from './_hooks';
import SwapLoadingPopup from '@/src/components/popups/SwapLoadingPopup';
import SwapSuccessPopup from '@/src/components/popups/SwapSuccessPopup';
import ReviewSwapPopup from '../get-krwo/add-ov/krwo-swap/_components/ReviewSwapPopup';
import TransactionFailPopup from '@/src/components/popups/TransactionFailPopup';
import AlertBox from './_components/AlertBox';
import { useDebounce } from '@/src/lib/hook/useDebounce';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import { useGetBalanceAndRoute } from './_hooks/useGetBalanceAndRoute';
import { useQueryClient } from '@tanstack/react-query';
import { insertComma } from '@/src/lib/utils/insertComma';
import { RECEIVE_TOKEN_DEFAULT } from './_constants/defaultState';
import { safeCalc } from '@/src/lib/utils/safeCalc';

export default function Swap() {
  const queryClient = useQueryClient();
  const { chainId } = useAccount();
  const { openPopup, closePopup } = usePopupStore((state) => state);

  const [payToken, setPayToken] = useState<TokenListType | undefined>();
  const [receiveToken, setReceiveToken] = useState<TokenListType | undefined>(
    RECEIVE_TOKEN_DEFAULT(chainId!),
  );
  const [inputFromType, setInputFromType] = useState<'pay' | 'receive'>();

  const { KRWOToken, setKRWOToken, oppositeToken, setOppositeToken } =
    classifyToken({
      payToken,
      receiveToken,
      setPayToken,
      setReceiveToken,
    });

  const [inputFromToken, setInputFromToken] =
    inputFromType === 'pay'
      ? [payToken, setPayToken]
      : [receiveToken, setReceiveToken];

  const [outputToken, setOutputToken] =
    inputFromType === 'pay'
      ? [receiveToken, setReceiveToken]
      : [payToken, setPayToken];

  const {
    debouncedValue: debouncedInputFrom,
    resetDebouncedValue,
    isDebouncing,
  } = useDebounce(inputFromToken, 500);

  const { balance, routes, isError, isPending } = useGetBalanceAndRoute({
    debouncedInputFrom,
    payToken,
    receiveToken,
    inputFromType,
  });

  const { receiveTokenText } = useGetReceiveTokenText({
    KRWOToken,
    routes,
    oppositeToken,
    isDebouncing,
    isPending,
    outputAmount: outputToken?.amount,
  });

  const { handleSwap } = useHandleSwap({
    chainId: chainId!,
    onPending: () => {
      openPopup(SwapLoadingPopup, {
        tokens: {
          pay: {
            symbol: payToken!.symbol,
            amount: payToken!.amount!,
          },
          receive: {
            symbol: receiveToken!.symbol,
            amount: receiveToken!.amount!,
          },
        },
        closePrevPopup: () => closePopup(SwapLoadingPopup),
      });
    },
    onSuccess: (hash) => {
      closePopup(ReviewSwapPopup);
      closePopup(SwapLoadingPopup);
      openPopup(SwapSuccessPopup, {
        hash,
        tokens: {
          pay: {
            symbol: payToken!.symbol,
            amount: payToken!.amount!,
          },
          receive: {
            symbol: receiveToken!.symbol,
            amount: receiveToken!.amount!,
          },
        },
        closePrevPopup: () => closePopup(SwapSuccessPopup),
      });
    },
    onError: () => {
      closePopup(SwapLoadingPopup);
      openPopup(TransactionFailPopup);
    },
  });

  const { buttonState } = useGetButtonState({
    payToken,
    receiveToken,
    setPayToken,
    setReceiveToken,
    routes,
    balance,
    isSearching: isPending,
    insufficientLiquidity: isError,
    handleSwap: () => handleSwap({ payToken, receiveToken, routes }),
  });

  const handleOpenRoutePopup = () => {
    if (!routes || !payToken || !receiveToken) return;
    openPopup(SwapRoutesPopup, {
      routes,
      payToken,
      receiveToken,
    });
  };

  useEffect(() => {
    setKRWOToken?.((prev) => ({
      ...prev!,
      contractAddress:
        KRWO.contractAddress[
          checkIsAvailableChain(chainId) ? chainId : defaultChain.id
        ],
      chainId: chainId!,
    }));
    setOppositeToken?.(undefined);
  }, [chainId]);

  useEffect(() => {
    if (isDebouncing) return;
    if (Number(inputFromToken?.amount) <= 0) {
      setOutputToken((prev) => ({
        ...prev!,
        amount: '',
        krwValue: '',
      }));
      setInputFromToken((prev) => ({
        ...prev!,
        krwValue: '',
      }));
      return;
    }
    if (
      routes &&
      inputFromToken &&
      inputFromToken.amount &&
      oppositeToken &&
      KRWOToken
    ) {
      setOutputToken((prev) => ({
        ...prev!,
        amount: applyDecimals(routes.amount, outputToken!.decimals, 18),
        krwValue:
          prev!.symbol === 'KRWO'
            ? applyDecimals(routes.amount, KRWOToken.decimals, 18)
            : safeCalc
                .multiply(
                  safeCalc.multiply(
                    routes.effectivePrice,
                    10 ** (oppositeToken.decimals - KRWOToken.decimals),
                  ),
                  applyDecimals(routes?.amount!, outputToken!.decimals, 18),
                )
                .toString(),
      }));

      setInputFromToken((prev) => ({
        ...prev!,
        krwValue:
          prev!.symbol === 'KRWO'
            ? prev?.amount
            : safeCalc
                .multiply(
                  safeCalc.multiply(
                    routes.effectivePrice,
                    10 ** (oppositeToken?.decimals - KRWOToken?.decimals),
                  ),
                  inputFromToken?.amount!,
                )
                .toString(),
      }));
    }
  }, [routes, inputFromToken?.amount]);

  return (
    <section className="flex flex-col pt-4">
      <div className="flex flex-col gap-2 w-full items-center">
        <SwapTokenBox
          type="pay"
          tokens={{ pay: payToken, receive: receiveToken }}
          setSelectedToken={setPayToken}
          setOppositeToken={setReceiveToken}
          exactInput={receiveToken?.symbol === 'KRWO'}
          balance={balance}
          setInputFromType={setInputFromType}
        />
        <button
          className="p-2 bg-purple-500 rounded-full lg:hover:rotate-180 duration-200 w-fit -my-6 z-10"
          onClick={() => {
            switchTokenOrder({
              payToken,
              receiveToken,
              setPayToken,
              setReceiveToken,
              resetRoutes: () =>
                queryClient.resetQueries({
                  queryKey: [
                    'swap-route',
                    debouncedInputFrom?.symbol,
                    debouncedInputFrom?.amount,
                    payToken?.symbol,
                    receiveToken?.symbol,
                  ],
                }),
            });
            resetDebouncedValue();
          }}
        >
          <ArrowDownIcon />
        </button>
        <SwapTokenBox
          type="receive"
          tokens={{ pay: payToken, receive: receiveToken }}
          setSelectedToken={setReceiveToken}
          setOppositeToken={setPayToken}
          exactInput={payToken?.symbol === 'KRWO'}
          balance={balance}
          setInputFromType={setInputFromType}
        />
      </div>
      <AlertBox
        payToken={payToken}
        receiveToken={receiveToken}
        isPriceImpactTooHigh={routes?.highPriceImpact ?? false}
      />
      <Button
        size="xl"
        color="primary"
        className="w-full my-4"
        onClick={buttonState().onClick}
        disabled={buttonState().disabled}
      >
        {buttonState().text}
      </Button>
      {payToken?.symbol && receiveToken?.symbol ? (
        <section className="flex flex-col gap-2 pb-1">
          <div className="flex flex-row justify-between">
            <p className="p1 text-black-8">Saved</p>
            <div
              className="flex flex-row gap-1 items-center cursor-pointer"
              onClick={handleOpenRoutePopup}
            >
              <p className="p1 text-purple-500">
                {routes?.saved !== undefined
                  ? `~ ₩ ${insertComma(routes?.saved.toString())} profit`
                  : '- profit'}
              </p>
              <ChevronDownIcon className="-rotate-90 stroke-purple-500 w-4 h-[16px]" />
            </div>
          </div>
          <div className="flex flex-row gap-2 justify-between">
            <p className="p1 text-black-8">Price</p>
            <p className="p1 text-black-8">{receiveTokenText}</p>
          </div>
          <div className="flex flex-row gap-2 justify-between">
            <p className="p1 text-black-8">Receive</p>
            <p className="p1 text-black-8">
              {receiveToken?.amount
                ? `~ ${insertComma(formatNumber(receiveToken.amount, 6))} ${
                    receiveToken.symbol
                  }`
                : '-'}
            </p>
          </div>
          <div className="flex flex-row gap-2 justify-between">
            <p className="p1 text-black-8">Gimswap fee</p>
            <p className="p1 text-black-8">Free</p>
          </div>
        </section>
      ) : null}
    </section>
  );
}
