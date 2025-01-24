'use client';

import Button from '@/src/components/Button';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { useAccount } from 'wagmi';
import { PositionType } from '../../_mock/liquidityAmount';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import AddRecommendLiquidityPopup from '../popup/AddRecommendLiquidityPopup';
import SelectChainPopup from '@/src/components/popups/SelectChainPopup';

interface PositionButtonProps {
  selectedPosition: PositionType | null;
}

export default function PositionButton({
  selectedPosition,
}: PositionButtonProps) {
  const { isConnected, chainId } = useAccount();
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
        onClick: () => openPopup(SelectChainPopup),
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
