import SelectChainPopup from '@/src/components/popups/SelectChainPopup';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { useAccount } from 'wagmi';
import SelectTokenPopup from '../_components/selectTokenPopup/SelectTokenPopup';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import { GetSwapRouteResponseType } from '@/src/lib/types/api/swap/GetSwapRouteType';
import { GetBalanceResponseType } from '@/src/lib/types/api/GetBalanceType';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import { useHandleSwapButton } from './useHandleSwapButton';
import { classifyToken } from '../_utils';

interface ButtonStateProps {
  payToken: TokenListType | undefined;
  receiveToken: TokenListType | undefined;
  routes: GetSwapRouteResponseType | undefined;
  isSearching: boolean;
  balance: GetBalanceResponseType['balance'] | undefined;
  insufficientLiquidity: boolean;
  setPayToken: React.Dispatch<React.SetStateAction<TokenListType | undefined>>;
  setReceiveToken: React.Dispatch<
    React.SetStateAction<TokenListType | undefined>
  >;
  handleSwap: () => void;
}

export const useGetButtonState = ({
  payToken,
  receiveToken,
  routes,
  isSearching,
  balance,
  insufficientLiquidity,
  setPayToken,
  setReceiveToken,
  handleSwap,
}: ButtonStateProps) => {
  const { address, chainId } = useAccount();
  const { openPopup } = usePopupStore((state) => state);

  const { KRWOToken, oppositeToken } = classifyToken({
    payToken,
    receiveToken,
  });

  const { handleSwapButton } = useHandleSwapButton();

  const buttonState = () => {
    if (!address)
      return {
        disabled: false,
        onClick: () => openPopup(SelectWalletPopup),
        text: 'Connect wallet',
      };

    if (
      (!checkIsAvailableChain(chainId) ||
        payToken?.chainId !== chainId ||
        receiveToken?.chainId !== chainId) &&
      payToken?.symbol &&
      receiveToken?.symbol
    )
      return {
        disabled: false,
        onClick: () => openPopup(SelectChainPopup),
        text: 'Switch network',
      };

    if (!payToken || !payToken.symbol || !receiveToken || !receiveToken.symbol)
      return {
        disabled: false,
        onClick: () =>
          openPopup(SelectTokenPopup, {
            setOppositeToken: setReceiveToken,
            setSelectedToken: setPayToken,
          }),
        text: 'Select token',
      };

    if (insufficientLiquidity) {
      return {
        disabled: true,
        text: 'Insufficient liquidity',
      };
    }

    if (isSearching) {
      return {
        disabled: true,
        text: 'Searching',
      };
    }

    if (
      payToken.amount === '0' ||
      receiveToken.amount === '0' ||
      !payToken.amount ||
      !receiveToken.amount
    )
      return {
        disabled: true,
        text: 'Enter amount',
      };

    if (
      !balance ||
      safeCalc.isGreater(
        payToken.amount,
        applyDecimals(
          balance[payToken.key.toLocaleLowerCase()],
          payToken.decimals,
          18,
        ),
      )
    ) {
      return {
        disabled: true,
        text: 'Insufficient balance',
      };
    }

    return {
      disabled: false,
      onClick: () =>
        handleSwapButton({
          payToken,
          receiveToken,
          routes,
          KRWOToken,
          oppositeToken,
          handleSwap,
        }),
      text: 'Swap',
    };
  };

  return { buttonState };
};
