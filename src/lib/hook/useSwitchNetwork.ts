import { useSwitchChain } from 'wagmi';

export default function useSwitchNetwork() {
  const { chains, switchChain } = useSwitchChain();
  const handleSwitch = async () => {
    switchChain({ chainId: chains[0].id });
  };
  return { switchChain: handleSwitch };
}
