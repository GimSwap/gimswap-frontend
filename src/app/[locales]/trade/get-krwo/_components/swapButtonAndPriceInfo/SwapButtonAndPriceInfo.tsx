import Button from "@/src/components/Button";
import { usePopupStore } from "@/src/lib/stores/popupStore/PopupStoreProvider";
import { TokenType } from "@/src/lib/types/TokenType";
import { useAccount } from "wagmi";
import SelectWalletPopup from "@/src/components/popups/SelectWalletPopup";
import SelectChainPopup from "@/src/components/popups/SelectChainPopup";
import { getServiceFeeStatus } from "@/src/app/[locales]/trade/get-krwo/add-ov/krwo-swap/_utils/getServiceFeeStatus";
import { insertComma } from "@/src/lib/utils/insertComma";
import { safeCalc } from "@/src/lib/utils/safeCalc";
import ReviewSwapPopup from "@/src/app/[locales]/trade/get-krwo/add-ov/krwo-swap/_components/ReviewSwapPopup";
import { checkIsAvailableChain } from "@/src/lib/utils/checkIsAvailableChain";
import { applyDecimals } from "@/src/lib/utils/calcTick";
import { KRWO, OPEN_VOUCHER } from "@/src/lib/constants/token";
import ReceiveAndSwapToggleBox from "./ReceiveAndSwapToggleBox";
import { useSwapHandler } from "../../add-ov/krwo-swap/_hooks/useSwapHandler";
import SwapSuccessPopup from "@/src/components/popups/SwapSuccessPopup";
import SwapLoadingPopup from "@/src/components/popups/SwapLoadingPopup";
import SwapErrorPopup from "@/src/components/popups/SwapErrorPopup";
import NoMoreAvailablePopup from "../../add-ov/krwo-swap/_components/NoMoreAvailablePopup";

interface SwapButtonProps {
  tokens: {
    pay: TokenType & { amount: string; value: string };
    receive: TokenType & { amount: string; value: string };
  };
  fee: number | null;
  isEnoughBalance: boolean;
  onComplete?: () => void;
  isServiceFeeActive: boolean;
  setIsServiceFeeActive: React.Dispatch<React.SetStateAction<boolean>>;
  nativeBalance: string | undefined;
  serviceFee: number | undefined;
}

export default function SwapButton({
  tokens,
  isEnoughBalance,
  onComplete,
  isServiceFeeActive,
  setIsServiceFeeActive,
  nativeBalance,
  serviceFee,
}: SwapButtonProps) {
  const { openPopup, closePopup } = usePopupStore((state) => state);
  const { isConnected, chainId } = useAccount();

  const { executeSwap } = useSwapHandler({
    isServiceFeeActive,
    onSuccess: (hash) => {
      closePopup(SwapLoadingPopup);
      closePopup(ReviewSwapPopup);
      openPopup(SwapSuccessPopup, {
        hash: hash!,
        tokens: {
          pay: {
            symbol: tokens.pay.symbol,
            amount: tokens.pay.amount,
          },
          receive: {
            symbol: tokens.receive.symbol,
            amount: isServiceFeeActive
              ? safeCalc
                  .subtract(tokens.receive.amount, decimalAppliedServiceFee)
                  .toString()
              : tokens.receive.amount,
          },
        },
        onComplete,
      });
    },
    onError: () => {
      closePopup(SwapLoadingPopup);
      openPopup(SwapErrorPopup);
    },
    onPending: () => {
      openPopup(SwapLoadingPopup, {
        tokens: {
          pay: tokens.pay,
          receive: tokens.receive,
        },
        closePrevPopup: () => closePopup(ReviewSwapPopup),
      });
    },
  });

  const decimalAppliedServiceFee = serviceFee
    ? applyDecimals(serviceFee, KRWO.decimal).toString()
    : "0";

  const serviceFeeStatus = getServiceFeeStatus({
    chainId,
    nativeBalance,
    isServiceFeeActive,
  });

  const openReviewSwapPopup = () => {
    if (tokens.receive.symbol !== OPEN_VOUCHER.symbol) {
      openPopup(NoMoreAvailablePopup);
      return;
    }

    openPopup(ReviewSwapPopup, {
      tokens: {
        pay: {
          ...tokens.pay,
          amount: tokens.pay.amount,
          value: tokens.pay.value,
          contractAddress: undefined,
        },
        receive: {
          ...tokens.receive,
          amount: isServiceFeeActive
            ? safeCalc
                .subtract(tokens.receive.amount, decimalAppliedServiceFee)
                .toString()
            : tokens.receive.amount,
          value: isServiceFeeActive
            ? safeCalc
                .subtract(tokens.receive.value, decimalAppliedServiceFee)
                .toString()
            : tokens.receive.value,
          contractAddress: undefined,
        },
      },
      priceRatio: 0.0001, // TODO: Will be changed according to the backend specifications when writing the Swap logic
      serviceFee: decimalAppliedServiceFee,
      isServiceFeeActive,
      swap: () =>
        executeSwap({
          token: tokens.pay,
          amount: tokens.pay.amount,
        }),
    });
  };

  const getButtonState = () => {
    if (!isConnected)
      return {
        disabled: false,
        text: "Connect Wallet",
        onClick: () => openPopup(SelectWalletPopup),
      };

    if (!checkIsAvailableChain(chainId))
      return {
        disabled: false,
        text: "Switch the Network",
        onClick: () => openPopup(SelectChainPopup),
      };

    if (tokens.pay.amount === "0")
      return {
        disabled: true,
        text: "Enter an amount",
      };

    if (!isEnoughBalance)
      return {
        disabled: true,
        text: "Insufficient Balance",
      };

    return {
      disabled: false,
      text: "Swap",
      onClick: openReviewSwapPopup,
    };
  };

  return (
    <>
      <Button
        onClick={getButtonState().onClick}
        disabled={getButtonState().disabled}
        className="my-6"
        color="primary"
        size="xl"
      >
        {getButtonState().text}
      </Button>
      {isConnected && (
        <>
          {tokens.receive.symbol !== OPEN_VOUCHER.symbol &&
            !serviceFeeStatus.isEnough && (
              <ReceiveAndSwapToggleBox
                isServiceFeeActive={isServiceFeeActive}
                setIsServiceFeeActive={setIsServiceFeeActive}
                decimalAppliedServiceFee={decimalAppliedServiceFee}
              />
            )}
          <section className="w-full flex flex-col gap-2 pt-[2px] pb-[6px]">
            {tokens.receive.symbol !== OPEN_VOUCHER.symbol && (
              <div className="flex flex-row justify-between">
                <p className="p1 text-black-8">Network fee</p>
                <p className={`p1 ${serviceFeeStatus.className}`}>
                  {serviceFeeStatus.text}
                </p>
              </div>
            )}
            <div className="flex flex-row justify-between">
              <p className="p1 text-black-8">Price</p>
              <p className="p1">1 KRWO = 0.0001 OV</p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="p1 text-black-8">Receive token</p>
              <p className="p1">
                {tokens.receive.amount !== "0"
                  ? `${insertComma(tokens.receive.amount)} ${tokens.receive.symbol}`
                  : "-"}
              </p>
            </div>
            <div className="flex flex-row justify-between">
              <p className="p1 text-black-8">Gimswap fee</p>
              <p className="p1">free</p>
            </div>
          </section>
        </>
      )}
    </>
  );
}
