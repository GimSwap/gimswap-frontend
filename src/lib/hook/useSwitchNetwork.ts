import { useSwitchChain } from 'wagmi';
import { kaia } from 'wagmi/chains';

export default function useSwitchNetwork() {
  const { switchChain } = useSwitchChain();
  const network = kaia;
  const handleSwitch = async () => {
    switchChain({
      chainId: network.id,
      addEthereumChainParameter: {
        nativeCurrency: {
          name: 'KAIA',
          symbol: 'KAIA',
          decimals: 18,
        },
        chainName: network.name,
        rpcUrls: network.rpcUrls.default.http,
        blockExplorerUrls: [network.blockExplorers.default.url],
      },
    });
  };
  return { switchChain: handleSwitch };
}
