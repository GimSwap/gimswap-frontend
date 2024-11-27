'use client';

import { useAccount } from 'wagmi';
import { fetchSendLog } from '../utils/api/fetchSendLog';

interface useAddTokenProps {
  address: string;
  symbol: string;
  image: string;
  decimals: number;
}

export const useAddToken = () => {
  const { connector } = useAccount();
  const addToken = async (props: useAddTokenProps) => {
    try {
      if (!connector) throw new Error('Connector not found');
      const provider = await connector.getProvider();
      if (!provider) throw new Error('Provider not found');
      // @ts-ignore
      await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            ...props,
          },
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      fetchSendLog({ name: 'addToken', error: errorMessage });
    }
  };

  return { addToken };
};
