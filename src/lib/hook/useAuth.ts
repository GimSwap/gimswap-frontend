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
import { fetchSendLog } from '../utils/api/fetchSendLog';

export const useAuth = () => {
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect({ config: wagmiConfig });
  const { chainId, isConnected } = useAccount();
  const currentUrl = `${window.location.hostname}${window.location.pathname}`;
  const connect = useCallback(
    async (wallet: (typeof WALLETS)[0]) => {
      const findConnector = connectors.find((c) => c.id === wallet.connectorId);
      try {
        throw new Error('test');
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        fetchSendLog({ name: 'connect', error: errorMessage });
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      fetchSendLog({ name: 'disconnect', error: errorMessage });
    }
  }, [disconnectAsync]);

  return { connect, disconnect };
};
