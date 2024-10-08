'use client';

interface useAddTokenProps {
  address: string;
  symbol: string;
  image: string;
  decimals: number;
}

export const useAddToken = () => {
  const addToken = async (props: useAddTokenProps) => {
    if (!window) return;
    try {
      await window.ethereum.request({
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
