import { useCallback } from 'react';
import {
  ConnectorNotFoundError,
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi';
import { WALLETS } from '@/src/lib/constants/wallets';
import { wagmiConfig } from '@/src/lib/utils/wagmi';
import { openMetamaskUrl } from '@/src/lib/utils/openMetamaskUrl';

export const useAuth = () => {
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect({ config: wagmiConfig });
  const { chainId, isConnected } = useAccount();
  const currentUrl = `${window.location.hostname}${window.location.pathname}`;
  const connect = useCallback(
    async (wallet: (typeof WALLETS)[0]) => {
      const findConnector = connectors.find((c) => c.id === wallet.connectorId);
      try {
        if (!wallet.installed && wallet.deepLink) {
          if (wallet.id === 'metaMask') {
            openMetamaskUrl(`${wallet.deepLink}${currentUrl}`);
            return;
          }
          window.open(`${wallet.deepLink}${currentUrl}`, '_blank');
          return;
        }

        if (isConnected) await disconnectAsync();
        await connectAsync({
          connector: findConnector!,
          chainId,
        });
      } catch (error) {
        console.log(error);
        if (error instanceof ConnectorNotFoundError) {
          throw new Error('there was no connector');
        }
      }
    },
    [connectors, connectAsync, chainId],
  );

  const disconnect = useCallback(async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error(error);
    }
  }, [disconnectAsync]);

  return { connect, disconnect };
};
