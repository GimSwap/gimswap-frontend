import { useSwitchChain } from 'wagmi';
import { kaia } from 'wagmi/chains';

export default function useSwitchNetwork() {
  const { chains, switchChain } = useSwitchChain();
  const handleSwitch = async () => {
    switchChain({
      chainId: chains[0].id,
      addEthereumChainParameter: {
        nativeCurrency: {
          name: 'KLAY',
          symbol: 'KLAY',
          decimals: 18,
        },
        chainName: 'Kaia',
        rpcUrls: kaia.rpcUrls.default.http,
        blockExplorerUrls: [kaia.blockExplorers.default.url],
      },
    });
  };
  return { switchChain: handleSwitch };
}
