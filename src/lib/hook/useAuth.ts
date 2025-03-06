import { useCallback } from 'react';
import {
  ConnectorNotFoundError,
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi';
import { WALLETS, WalletType } from '@/src/lib/constants/wallets';
import { wagmiConfig, wagmiStorage } from '@/src/lib/utils/wagmi';
import { openMetamaskUrl } from '@/src/lib/utils/openMetamaskUrl';
import { fetchSendLog } from '../utils/api/fetchSendLog';
import { checkIsMobileDevice } from '../utils/checkIsMobileDevice';
import { defaultChain } from '../constants/token';
import { usePopupStore } from '../stores/popupStore/PopupStoreProvider';
import QrCodePopup from '@/src/components/popups/QrCodePopup';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import { setMixpanelUser } from '../utils/mixpanel/setMixpanelUser';

const shouldProceedInAppBrowser = (wallet: WalletType) =>
  !wallet.installed &&
  wallet.deepLink &&
  checkIsMobileDevice() &&
  wallet.supportInAppBrowser;

const shouldShowQrCode = (wallet: (typeof WALLETS)[number]) =>
  wallet.deepLink &&
  wallet.useWalletConnect &&
  wallet.qrCode &&
  !wallet.supportInAppBrowser;

const isMetaMask = (walletId: string) => walletId === 'metaMaskSDK';

export const useAuth = () => {
  const { connectAsync, connectors, isPending, reset } = useConnect();
  const { disconnectAsync, disconnect: _disconnect } = useDisconnect({
    config: wagmiConfig,
  });
  const { isConnected, connector } = useAccount();
  const { openPopup, closePopup } = usePopupStore((state) => state);
  const currentUrl =
    typeof window !== 'undefined'
      ? `${window.location.hostname}${window.location.pathname}`
      : '';

  const connect = useCallback(
    async (
      wallet: WalletType,
      reload?: boolean,
      chainId: number = defaultChain.id,
    ) => {
      let findConnector;

      if (wallet.useWalletConnect) {
        findConnector = connectors.find(
          (connector) => connector.id === 'walletConnect',
        );
      } else {
        findConnector = connectors.find((connector) =>
          wallet.connectorId.includes(connector.id),
        );
      }
      if (!findConnector) throw new Error('Connector not found');
      try {
        if (shouldProceedInAppBrowser(wallet)) {
          if (isMetaMask(wallet.id)) {
            openMetamaskUrl(`${wallet.deepLink}${currentUrl}`);
            return;
          } else {
            window.open(`${wallet.deepLink}${currentUrl}`, '_blank');
            return;
          }
        }

        if (shouldShowQrCode(wallet)) {
          const qrCode = wallet.qrCode;
          if (checkIsMobileDevice()) {
            qrCode?.then((uri) => {
              window.location.href = `${wallet.deepLink}?uri=${encodeURIComponent(uri)}`;
            });
          } else {
            closePopup(SelectWalletPopup);
            openPopup(QrCodePopup, {
              wallet,
              reset,
              connect: async () =>
                await connectAsync({
                  connector: findConnector!,
                  chainId,
                }),
            });
          }
        }

        if (isConnected) await disconnectAsync();

        const { accounts, chainId: connectedChainId } = await connectAsync({
          connector: findConnector!,
          chainId,
        });

        setMixpanelUser({
          walletAddress: accounts[0],
          chainId: connectedChainId,
        });

        closePopup(QrCodePopup);
        reload && window.location.reload();
      } catch (error) {
        reset();
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        fetchSendLog({ name: 'connect', error: errorMessage });
        if (error instanceof ConnectorNotFoundError) {
          throw new Error('there was no connector');
        }
      }
    },
    [connectors, connectAsync],
  );

  const disconnect = async (reload?: boolean) => {
    try {
      await disconnectAsync();
      reload && window.location.reload();
      connector && (await wagmiStorage.setItem('disconnect', connector.id));
    } catch (error) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      fetchSendLog({ name: 'disconnect', error: errorMessage });
    }
  };

  return { connect, disconnect, isConnecting: isPending, reset };
};
