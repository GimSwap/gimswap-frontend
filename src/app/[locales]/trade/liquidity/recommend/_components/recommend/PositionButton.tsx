'use client';

import Button from '@/src/components/Button';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { useAccount } from 'wagmi';
import { PositionType } from '../../_mock/liquidityAmount';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import useSwitchNetwork from '@/src/lib/hook/useSwitchNetwork';
import AddRecommendLiquidityPopup from '../popup/AddRecommendLiquidityPopup';

interface PositionButtonProps {
  selectedPosition: PositionType | null;
}

export default function PositionButton({
  selectedPosition,
}: PositionButtonProps) {
  const { isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchNetwork();
  const { openPopup } = usePopupStore((state) => state);

  const buttonState = () => {
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
        onClick: switchChain,
      };

    if (!selectedPosition) {
      return {
        title: 'Select Liquidity',
        disabled: true,
      };
    }
    return {
      title: 'Add Liquidity',
      disabled: false,
      onClick: () => openPopup(AddRecommendLiquidityPopup, undefined, true),
    };
  };
  return (
    <Button {...buttonState()} color="primary" size="xl" className="mt-6">
      {buttonState().title}
    </Button>
  );
}
