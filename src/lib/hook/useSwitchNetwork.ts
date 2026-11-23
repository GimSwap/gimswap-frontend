import { useSwitchChain } from 'wagmi';
import { chains } from '../utils/wagmi';
import { usePopupStore } from '../stores/popupStore/PopupStoreProvider';

export default function useSwitchNetwork() {
  const { switchChain } = useSwitchChain();
  const { closeAllPopup } = usePopupStore((state) => state);

  const handleSwitch = async (targetChainId: number) => {
    const targetChain = chains.find((chain) => chain.id === targetChainId);
    if (!targetChain) {
      console.error('No target chain found');
      return;
    }
    if (!targetChain.blockExplorers) console.error('No block explorers found');
    switchChain({
      chainId: targetChain.id,
      addEthereumChainParameter: {
        nativeCurrency: {
          name: targetChain.name,
          symbol: targetChain.nativeCurrency.symbol,
          decimals: targetChain.nativeCurrency.decimals,
        },
        chainName: targetChain.name,
        rpcUrls: targetChain.rpcUrls.default.http,
        blockExplorerUrls: [targetChain.blockExplorers!.default.url!],
      },
    });
    closeAllPopup();
  };
  return { switchChain: handleSwitch };
}
