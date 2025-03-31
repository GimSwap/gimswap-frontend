import React, { memo, useEffect } from 'react';
import { shortenAddress } from '../../lib/utils/shortenAddress';
import { useAccount } from 'wagmi';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import { WALLET_ICONS } from '@/src/lib/constants/walletIcons';
import WalletInfoPopup from './WalletInfoPopup';
import { CHAIN_ICONS } from '@/src/lib/constants/token';
import ExclamationIcon from '@/public/svg/exclamation.svg';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { isInBinance } from '@binance/w3w-utils';
import { bsc } from 'wagmi/chains';
import { wagmiStorage } from '@/src/lib/utils/wagmi';
import { fetchSendLog } from '@/src/lib/utils/api/fetchSendLog';
import { useGetCurrentWallet } from '@/src/lib/hook/useGetCurrentWallet';

interface WalletConnectButtonProps {
  size: 'small' | 'large';
}

const WalletConnectButton = memo(({ size }: WalletConnectButtonProps) => {
  const { openPopup } = usePopupStore((state) => state);
  const { address, isConnected, chainId } = useAccount();
  const _chainIcon = chainId ? CHAIN_ICONS[chainId] : null;
  const ChainIcon = _chainIcon ? _chainIcon : ExclamationIcon;
  const { data: walletInfo } = useGetCurrentWallet();

  const buttonTitle = () => {
    switch (size) {
      case 'small':
        return (
          <div className="flex flex-row items-center gap-1">
            {isConnected && (
              <ChainIcon
                className={`h-4 w-4 rounded-full ${
                  checkIsAvailableChain(chainId) ? '' : 'bg-[#FDEDED]'
                }`}
              />
            )}
            {WalletIcon && <WalletIcon className="h-[16px] w-4 rounded-full" />}
            <p className="c1 font-bold text-black-1">
              {address ? shortenAddress(address) : 'Connect'}
            </p>
          </div>
        );

      case 'large':
        return (
          <div className="flex flex-row items-center gap-1">
            {isConnected && (
              <ChainIcon
                className={`h-[24px] w-6 rounded-full ${
                  checkIsAvailableChain(chainId) ? '' : 'bg-[#FDEDED]'
                }`}
              />
            )}
            {WalletIcon && <WalletIcon className="h-6 w-6 rounded-full" />}
            <h5 className="text-h5 font-bold text-black-1">
              {address ? shortenAddress(address) : 'Connect Wallet'}
            </h5>
          </div>
        );
    }
  };

  const WalletIcon = walletInfo ? WALLET_ICONS[walletInfo.title] : null;

  useEffect(() => {
    const disconnectedConnector = wagmiStorage.getItem('disconnect');

    if (
      isInBinance() &&
      !isConnected &&
      typeof window !== 'undefined' &&
      window.ethereum &&
      (disconnectedConnector === 'BinanceW3WSDK' ||
        disconnectedConnector === 'wallet.binance.com')
    ) {
      window.ethereum.request({
        method: 'eth_requestAccounts',
        chainId: bsc.id,
      });
    }
    if (
      isInBinance() &&
      disconnectedConnector !== 'BinanceW3WSDK' &&
      disconnectedConnector !== 'wallet.binance.com'
    )
      fetchSendLog({
        name: 'connect',
        error: 'currentConnectorId',
        currentConnectorId: disconnectedConnector,
      });
  }, [isInBinance(), isConnected]);

  return (
    <button
      className={`flex items-center justify-center rounded-lg bg-purple-500 font-medium ${
        size === 'small' ? 'c1 gap-1 px-3 py-2' : 'gap-2 px-4 py-3'
      } w-full`}
      onClick={() =>
        openPopup(isConnected ? WalletInfoPopup : SelectWalletPopup, {
          reloadOnConnect: false,
        })
      }
    >
      {buttonTitle()}
    </button>
  );
});

export default WalletConnectButton;
