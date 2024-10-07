// WalletConnectButton.tsx
import React, { memo } from 'react';
import { shortenAddress } from '../lib/utils/shortenAddress';
import { useAccount } from 'wagmi';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import { WALLET_ICONS } from '@/src/lib/constants/walletIcons';

interface WalletConnectButtonProps {
  size: 'small' | 'large';
}

const WalletConnectButton = memo(({ size }: WalletConnectButtonProps) => {
  const { openPopup } = usePopupStore((state) => state);
  const { address, connector } = useAccount();

  const handleOpen = async () => {
    try {
      openPopup(SelectWalletPopup);
    } catch (err) {
      console.error('Failed to open wallet connect modal', err);
    }
  };

  const buttonTitle = () => {
    switch (size) {
      case 'small':
        return (
          <>
            {WalletIcon && <WalletIcon className="w-4 h-4 rounded-full" />}
            <p className="c1 font-bold text-black-1">
              {address ? shortenAddress(address) : 'Connect'}
            </p>
          </>
        );

      case 'large':
        return (
          <>
            {WalletIcon && <WalletIcon className="w-6 h-6 rounded-full" />}
            <h5 className="text-h5 font-bold text-black-1">
              {address ? shortenAddress(address) : 'Connect Wallet'}
            </h5>
          </>
        );
    }
  };

  const WalletIcon = connector ? WALLET_ICONS[connector.name] : null;
  return (
    <button
      className={`bg-purple-500 font-medium rounded-lg flex items-center justify-center ${
        size === 'small' ? 'c1 py-2 px-3 gap-1' : 'py-3 px-4 gap-2'
      }`}
      onClick={handleOpen}
    >
      {buttonTitle()}
    </button>
  );
});

export default WalletConnectButton;
