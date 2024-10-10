'use client';

import { useAccount } from 'wagmi';

interface useAddTokenProps {
  address: string;
  symbol: string;
  image: string;
  decimals: number;
}

export const useAddToken = () => {
  const { connector } = useAccount();
  const addToken = async (props: useAddTokenProps) => {
    if (!connector) return;
    const provider = await connector.getProvider();
    try {
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
    } catch (err) {
      console.error(err);
    }
  };

  return { addToken };
};
