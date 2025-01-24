import ChevronRight from '@/public/svg/chevron/right.svg';
import WalletInfoPopup from '@/src/components/connectWallet/WalletInfoPopup';
import SelectWalletPopup from '@/src/components/popups/SelectWalletPopup';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { useAccount } from 'wagmi';

export default function UnsupportedNetworkOrNeedConnect() {
  const { openPopup } = usePopupStore((state) => state);
  const { isConnected } = useAccount();
  const handleClick = () => {
    if (isConnected) {
      openPopup(WalletInfoPopup);
    } else {
      openPopup(SelectWalletPopup);
    }
  };
  return (
    <section
      className="flex flex-row justify-between bg-black-3 rounded-lg px-3 py-2 mt-3"
      onClick={handleClick}
    >
      <p className="p1 text-black-8">
        {isConnected ? 'Unsupported network' : 'Connect wallet'}
      </p>
      <ChevronRight className="w-5 h-5 stroke-black-8" />
    </section>
  );
}
