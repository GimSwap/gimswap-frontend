import Button from '@/src/components/Button';
import { useAccount } from 'wagmi';
import { makeSignMessage } from '../_utils/makeSignMessage';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import useSign from '@/src/lib/hook/useSign';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import SelectChainPopup from '@/src/components/popups/SelectChainPopup';
import TransferSignPopup from '../../../quick-deposit/transfer/_components/TransferSignPopup';
import { useGetCurrentWallet } from '@/src/lib/hook/useGetCurrentWallet';
import { checkIsMobileDevice } from '@/src/lib/utils/checkIsMobileDevice';
import TransferSignSuccessPopup from '../../../quick-deposit/transfer/_components/TransferSignSuccessPopup';
import { checkIsMobileBrowser } from '@/src/lib/utils/checkIsMobileBrowser';

interface BuyButtonProps {
  amount: string;
}

export default function BuyButton({ amount }: BuyButtonProps) {
  const { sign } = useSign();
  const { address, isConnected, chainId, connector } = useAccount();
  const { openPopup, closePopup } = usePopupStore((state) => state);
  const { data: currentWallet } = useGetCurrentWallet();

  const handleOpenVoucherPayment = (
    signature: string,
    signMessage: string,
    method: 'purchase' | 'history',
  ) => {
    if (!address || !chainId || !connector || !currentWallet) return;

    const methodUrl = {
      purchase: 'buy',
      history: 'transactions',
    };

    const searchParams = new URLSearchParams({
      amount,
      method,
      walletAddress: address,
      redirectOnSuccess: `${window.location.origin}/trade/swap`,
      redirectOnError: window.location.href,
      redirectOnCancel: window.location.href,
      signature,
      signMessage: btoa(signMessage),
      chainId: chainId.toString(),
      walletId: currentWallet.connectorId[0],
    });
    closePopup(TransferSignPopup);
    if (checkIsMobileBrowser('metamask')) {
      window.location.href = `${process.env.NEXT_PUBLIC_OPEN_VOUCHER_URL}/payment/${methodUrl[method]}?${searchParams.toString()}`;
    } else {
      const popup = window.open(
        `${process.env.NEXT_PUBLIC_OPEN_VOUCHER_URL}/payment/${methodUrl[method]}?${searchParams.toString()}`,
        '_blank',
        'popup=true,width=380,height=780',
      );
      if (!popup) alert('Please disable the popup blocker.');
    }
  };

  const handleBuy = async () => {
    if (!isConnected) return openPopup(SelectWalletPopup);
    openPopup(TransferSignPopup);
    const signMessage = makeSignMessage(address);
    if (!address || !signMessage || !chainId || !connector || !currentWallet)
      return;

    const signature = await sign(address, signMessage, currentWallet);
    closePopup(TransferSignPopup);
    if (!signature) return;

    openPopup(TransferSignSuccessPopup, {
      handleOpenOpenVoucher: () =>
        handleOpenVoucherPayment(signature, signMessage, 'purchase'),
    });

    if (!signature) return;

    if (
      checkIsMobileDevice() &&
      currentWallet &&
      !currentWallet.supportInAppBrowser
    )
      return;

    handleOpenVoucherPayment(signature, signMessage, 'purchase');
  };

  const BuyButtonState = () => {
    if (!isConnected || !currentWallet)
      return {
        title: 'Connect Wallet',
        disabled: false,
        onClick: () =>
          openPopup(SelectWalletPopup, {
            reloadOnConnect: false,
          }),
      };

    if (!checkIsAvailableChain(chainId))
      return {
        title: 'Switch Network',
        disabled: false,
        onClick: () => openPopup(SelectChainPopup),
      };
    if (+amount <= 0)
      return {
        title: 'Enter an amount',
        disabled: true,
      };

    return {
      title: 'Sign and Buy',
      disabled: false,
      onClick: handleBuy,
    };
  };

  const handleHistoryButtonClick = async () => {
    if (!isConnected) return;
    const signMessage = makeSignMessage(address);
    if (!address || !signMessage || !currentWallet) return;
    openPopup(TransferSignPopup);
    const signature = await sign(address, signMessage, currentWallet);
    if (!signature) return;
    handleOpenVoucherPayment(signature, signMessage, 'history');
  };

  return (
    <>
      <Button
        {...BuyButtonState()}
        className="mt-6 mb-4"
        color="primary"
        size="xl"
      >
        {BuyButtonState().title}
      </Button>
      <button
        className="c1 font-medium text-black-8 underline underline-offset-[3px] text-center"
        onClick={handleHistoryButtonClick}
      >
        {isConnected ? 'View History' : ''}
      </button>
    </>
  );
}
