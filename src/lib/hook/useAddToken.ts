'use client';

import { watchAsset } from '@wagmi/core';
import { wagmiConfig } from '@/src/lib/utils/wagmi';

interface useAddTokenProps {
  address: string;
  symbol: string;
  image: string;
  decimals: number;
}

export const useAddToken = () => {
  const addToken = async (props: useAddTokenProps) => {
    try {
      await watchAsset(wagmiConfig, {
        type: 'ERC20',
        options: {
          ...props,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return { addToken };
};
