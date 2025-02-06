import React, { memo } from 'react';
import { shortenAddress } from '../../lib/utils/shortenAddress';
import { useAccount } from 'wagmi';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import { WALLET_ICONS } from '@/src/lib/constants/walletIcons';
import WalletInfoPopup from './WalletInfoPopup';
import { CHAIN_ICONS } from '@/src/lib/constants/token';
import ExclamationIcon from '@/public/svg/exclamation.svg';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';

interface WalletConnectButtonProps {
  size: 'small' | 'large';
}

const WalletConnectButton = memo(({ size }: WalletConnectButtonProps) => {
  const { openPopup } = usePopupStore((state) => state);
  const { address, connector, isConnected, chainId } = useAccount();
  const _chainIcon = chainId ? CHAIN_ICONS[chainId] : null;
  const ChainIcon = _chainIcon ? _chainIcon : ExclamationIcon;

  const buttonTitle = () => {
    switch (size) {
      case 'small':
        return (
          <div className="flex flex-row gap-1 items-center">
            {isConnected && (
              <ChainIcon
                className={`w-4 h-4 rounded-full ${
                  checkIsAvailableChain(chainId) ? '' : 'bg-[#FDEDED]'
                }`}
              />
            )}
            {WalletIcon && <WalletIcon className="w-4 h-[16px] rounded-full" />}
            <p className="c1 font-bold text-black-1">
              {address ? shortenAddress(address) : 'Connect'}
            </p>
          </div>
        );

      case 'large':
        return (
          <div className="flex flex-row gap-1 items-center">
            {isConnected && (
              <ChainIcon
                className={`w-6 h-[24px] rounded-full ${
                  checkIsAvailableChain(chainId) ? '' : 'bg-[#FDEDED]'
                }`}
              />
            )}
            {WalletIcon && <WalletIcon className="w-6 h-6 rounded-full" />}
            <h5 className="text-h5 font-bold text-black-1">
              {address ? shortenAddress(address) : 'Connect Wallet'}
            </h5>
          </div>
        );
    }
  };

  const WalletIcon = connector ? WALLET_ICONS[connector.name] : null;
  return (
    <button
      className={`bg-purple-500 font-medium rounded-lg flex items-center justify-center ${
        size === 'small' ? 'c1 py-2 px-3 gap-1' : 'py-3 px-4 gap-2'
      } w-full`}
      onClick={() =>
        openPopup(isConnected ? WalletInfoPopup : SelectWalletPopup)
      }
    >
      {buttonTitle()}
    </button>
  );
});

export default WalletConnectButton;
