import Button from '@/src/components/Button';
import { useAccount } from 'wagmi';
import { makeSignMessage } from '../_utils/makeSignMessage';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import useSign from '@/src/lib/hook/useSign';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import useSwitchNetwork from '@/src/lib/hook/useSwitchNetwork';

interface BuyButtonProps {
  amount: string;
}

export default function BuyButton({ amount }: BuyButtonProps) {
  const { address, isConnected, chainId } = useAccount();
  const { openPopup } = usePopupStore((state) => state);
  const { switchChain } = useSwitchNetwork();
  const { sign } = useSign();

  const handleOpenVoucherPayment = (url: string) => {
    window.open(url, 'openvoucherPayment', 'popup=true,width=380,height=780');
  };

  const handleBuy = async () => {
    if (!isConnected) return openPopup(SelectWalletPopup);

    const signMessage = makeSignMessage(address);
    if (!address || !signMessage || !chainId) return;

    const signature = await sign(address, signMessage);
    if (!signature) return;

    const searchParams = new URLSearchParams({
      amount,
      method: 'purchase',
      walletAddress: address,
      redirectOnSuccess: `${window.location.origin}/trade/swap`,
      redirectOnError: window.location.href,
      signature,
      signMessage: btoa(signMessage),
      chainId: chainId.toString(),
    });

    handleOpenVoucherPayment(
      `${process.env.NEXT_PUBLIC_OPEN_VOUCHER_URL}/payment/buy?${searchParams.toString()}`,
    );
  };

  const BuyButtonState = () => {
    console.log(chainId);
    if (!isConnected)
      return {
        title: 'Connect Wallet',
        disabled: false,
        onClick: () => openPopup(SelectWalletPopup),
      };

    if (!checkIsAvailableChain(chainId))
      return {
        title: 'Switch Network',
        disabled: false,
        onClick: async () => await switchChain(),
      };
    if (+amount <= 0)
      return {
        title: 'Enter an amount',
        disabled: true,
      };

    return {
      title: 'Buy',
      disabled: false,
      onClick: handleBuy,
    };
  };
  const handleHistoryButtonClick = async () => {
    if (!isConnected) return;
    const signMessage = makeSignMessage(address);
    if (!address || !signMessage) return;

    const signature = await sign(address, signMessage);
    if (!signature) return;

    const searchParams = new URLSearchParams({
      method: 'history',
      walletAddress: address,
      redirectOnSuccess: `${window.location.origin}/trade/swap`,
      redirectOnError: window.location.href,
      signature,
      signMessage: btoa(signMessage),
      chainId: process.env.NEXT_PUBLIC_KLAYTN_CHAIN_ID!,
    });

    handleOpenVoucherPayment(
      `${process.env.NEXT_PUBLIC_OPEN_VOUCHER_URL}/payment/transactions?${searchParams.toString()}`,
    );
  };
  return (
    <>
      <Button
        {...BuyButtonState()}
        className="bg-purple-500 text-black-1 mt-6 mb-4"
      />
      <button
        className="c1 font-medium text-black-8 underline underline-offset-[3px] text-center"
        onClick={handleHistoryButtonClick}
      >
        {isConnected ? 'View History' : ''}
      </button>
    </>
  );
}
