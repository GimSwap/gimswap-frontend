import Button from '@/src/components/Button';
import SwapConfirmPopup from '@/src/components/popups/SwapConfirmPoup';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { TokenType } from '@/src/lib/types/TokenType';
import useSwitchNetwork from '@/src/lib/hook/useSwitchNetwork';
import { useAccount, useConfig } from 'wagmi';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import { useCallback } from 'react';

interface SwapButtonProps {
  tokens: { pay: TokenType; receive: TokenType };
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  fee: number | null;
  isEnoughBalance: boolean;
  onComplete: () => void;
}

export const SwapButton = ({
  tokens,
  amount,
  setAmount,
  fee,
  isEnoughBalance,
  onComplete,
}: SwapButtonProps) => {
  const { openPopup } = usePopupStore((state) => state);
  const { isConnected, chain } = useAccount();
  const { chains } = useConfig();
  const { switchChain } = useSwitchNetwork();
  const isWrongNetwork = chains.every(
    (availableChain) => availableChain.id !== chain?.id,
  );

  const handleButtonClick = async () => {
    if (!isConnected) {
      openPopup(SelectWalletPopup);
      return;
    }

    if (isWrongNetwork) {
      await switchChain();
      return;
    }

    openPopup(SwapConfirmPopup, {
      tokens,
      amount,
      setAmount,
      fee,
      onComplete,
    });
  };

  const buttonTitle = useCallback(() => {
    if (!isConnected) return 'Connect Wallet';
    if (isWrongNetwork) return 'Switch the Network';
    if (amount === '0') return 'Enter an amount';
    if (!isEnoughBalance) return 'Insufficient Balance';
    return 'Swap';
  }, [isConnected, isWrongNetwork, amount, isEnoughBalance, chain?.id]);

  const isButtonEnabled = () => {
    if (isWrongNetwork) return true;
    if (!isConnected) return true;
    return isEnoughBalance && amount && amount !== '0';
  };

  return (
    <Button
      onClick={handleButtonClick}
      title={buttonTitle()}
      disabled={!isButtonEnabled()}
      className="bg-purple-500 text-black-1 mt-6"
    />
  );
};
