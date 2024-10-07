import { useAccount, useConfig } from 'wagmi';

export const useActiveChain = () => {
  const { chain } = useAccount();
  const { chains } = useConfig();
  return {
    chain,
    isWrongNetwork: chains.every(
      (availableChain) => availableChain.id !== chain?.id,
    ),
  };
};
