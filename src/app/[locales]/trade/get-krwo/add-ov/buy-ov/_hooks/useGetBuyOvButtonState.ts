import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { useOpenPaymentPopup } from '@/src/lib/hook/useOpenPaymentPopup';
import { useAccount } from 'wagmi';

export const useGetBuyOvButtonState = () => {
  const { isConnected, address, chainId } = useAccount();
  const { openPopup } = usePopupStore((state) => state);
  const { openOVPaymentPopup } = useOpenPaymentPopup();

  const buttonState = (amount: string) => {
    if (!isConnected)
      return {
        disabled: false,
        text: 'Connect wallet',
        onClick: () => openPopup(SelectWalletPopup),
      };

    if (!amount || +amount < 1)
      return {
        disabled: true,
        text: 'Enter amount',
      };

    return {
      disabled: false,
      text: 'Buy OV',
      onClick: async () => {
        if (!address || !chainId) return;
        await openOVPaymentPopup({
          amount: amount,
          method: 'purchase',
          redirectOnCancel: window.location.href,
          redirectOnError: window.location.href,
          redirectOnSuccess: `${window.location.origin}/trade/get-krwo/add-ov/krwo-swap`,
        });
      },
    };
  };

  return { buttonState };
};
