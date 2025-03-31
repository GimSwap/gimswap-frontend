import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { type EthereumProvider } from '@walletconnect/ethereum-provider';
import { WALLETS } from '../constants/wallets';

export const useGetCurrentWallet = () => {
  const { connector } = useAccount();
  const [isProviderLoaded, setIsProviderLoaded] = useState(false);
  const [provider, setProvider] = useState<InstanceType<
    typeof EthereumProvider
  > | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!connector || connector.name !== 'WalletConnect') {
        setProvider(null);
        setIsProviderLoaded(true);
        return;
      }

      if (typeof connector.getProvider !== 'function') {
        setProvider(null);
        setIsProviderLoaded(true);
        return;
      }

      try {
        const loadedProvider = (await connector.getProvider()) as InstanceType<
          typeof EthereumProvider
        >;
        setProvider(loadedProvider);
      } catch (error) {
        setProvider(null);
      } finally {
        setIsProviderLoaded(true);
      }
    };

    fetchProvider();
  }, [connector]);

  return useQuery({
    queryKey: [
      'walletProvider',
      connector?.name,
      provider?.session?.peer.metadata.name,
    ],
    queryFn: async () => {
      if (!connector) return null;

      const currentWallet = WALLETS.find(
        (wallet) => wallet.id === connector?.id,
      );
      if (currentWallet) return currentWallet;
      else {
        if (!provider?.session) return null;
        console.log(provider.session?.peer.metadata.name);
        return WALLETS.find(
          (wallet) => wallet.id === provider.session?.peer.metadata.name,
        );
      }
    },
    enabled: !!connector && isProviderLoaded,
  });
};
