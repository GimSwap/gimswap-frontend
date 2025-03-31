import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { GetSwapRouteResponseType } from '@/src/lib/types/api/swap/GetSwapRouteType';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import ReviewSwapPopup from '../../get-krwo/add-ov/krwo-swap/_components/ReviewSwapPopup';
import { applyDecimals } from '@/src/lib/utils/calcTick';

interface UseHandleSwapButtonProps {
  payToken: TokenListType | undefined;
  receiveToken: TokenListType | undefined;
  routes: GetSwapRouteResponseType | undefined;
  KRWOToken: TokenListType | undefined;
  oppositeToken: TokenListType | undefined;
  handleSwap: () => void;
}

export const useHandleSwapButton = () => {
  const { openPopup } = usePopupStore((state) => state);

  const handleSwapButton = ({
    payToken,
    receiveToken,
    routes,
    KRWOToken,
    oppositeToken,
    handleSwap,
  }: UseHandleSwapButtonProps) => {
    if (
      !payToken?.amount ||
      !receiveToken?.amount ||
      !routes ||
      !KRWOToken ||
      !KRWOToken.amount ||
      !oppositeToken ||
      !oppositeToken.amount
    )
      return;

    openPopup(ReviewSwapPopup, {
      tokens: {
        pay: {
          ...payToken,
          amount: payToken.amount,
          value: KRWOToken.amount,
        },
        receive: {
          ...receiveToken,
          amount: receiveToken.amount,
          value: KRWOToken.amount,
        },
      },
      priceRatio: Number(
        formatNumber(
          safeCalc.divide(oppositeToken.amount, KRWOToken.amount).toString(),
          6,
        ),
      ),
      isServiceFeeActive: false,
      serviceFee: '0',
      swap: handleSwap,
      needApprove:
        payToken.key !== 'native' &&
        safeCalc.isGreater(
          payToken.amount,
          applyDecimals(routes.fromTokenAllowance, payToken.decimals),
        ),
      routes,
    });
  };

  return { handleSwapButton };
};
