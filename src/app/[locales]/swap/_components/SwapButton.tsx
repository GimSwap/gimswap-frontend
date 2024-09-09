import Button from '@/src/components/Button';
import SwapConfirmPopup from '@/src/components/popups/SwapConfirmPoup';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { TokenType } from '@/src/lib/types/TokenType';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';

interface SwapButtonProps {
  tokens: { pay: TokenType; receive: TokenType };
  amount: string;
  fee: number | null;
  isEnoughBalance: boolean;
}

export const SwapButton = ({
  tokens,
  amount,
  fee,
  isEnoughBalance,
}: SwapButtonProps) => {
  const { openPopup } = usePopupStore((state) => state);
  const { isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  const handleButtonClick = () => {
    if (!isConnected) {
      open();
      return;
    }
    openPopup(SwapConfirmPopup, {
      tokens,
      amount,
      fee,
    });
  };

  const buttonTitle = () => {
    if (!isConnected) return 'Connect Wallet';
    if (!amount) return 'Enter an amount';
    if (!isEnoughBalance) return 'Insufficient Balance';
    else return 'Swap';
  };
  return (
    <Button
      onClick={handleButtonClick}
      title={buttonTitle()}
      disabled={amount === '0' || !isEnoughBalance || !amount}
      className="bg-purple-500 text-black-1 mt-6"
    />
  );
};
