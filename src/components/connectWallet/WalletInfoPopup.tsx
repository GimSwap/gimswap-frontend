import { useAccount } from 'wagmi';
import PopupTemplate from '../PopupTemplate';
import { WALLET_ICONS } from '@/src/lib/constants/walletIcons';
import { shortenAddress } from '@/src/lib/utils/shortenAddress';
import ExclamationIcon from '@/public/svg/exclamation.svg';
import { CHAIN_ICONS, CHAIN_NAME_MAP } from '@/src/lib/constants/token';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import ChevronDownIcon from '@/public/svg/chevron/down.svg';
import Button from '@/src/components/Button';
import { copyToClipboard } from '@/src/lib/utils/copyToClipboard';
import { useAuth } from '@/src/lib/hook/useAuth';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SelectChainPopup from '../popups/SelectChainPopup';
import { useGetCurrentWallet } from '@/src/lib/hook/useGetCurrentWallet';

interface WalletInfoPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function WalletInfoPopup({
  open,
  onClose,
}: WalletInfoPopupProps) {
  const { disconnect } = useAuth();
  const { address, chainId } = useAccount();
  const { openPopup } = usePopupStore((state) => state);

  const { data: walletInfo } = useGetCurrentWallet();

  const WalletIcon = walletInfo ? WALLET_ICONS[walletInfo.title] : null;
  const _chainIcon = chainId ? CHAIN_ICONS[chainId] : null;
  const chainIcon = _chainIcon ? (
    <_chainIcon className="w-4 h-4 rounded-full" />
  ) : (
    <ExclamationIcon className="w-5 h-5 rounded-full fill-[#FDEDED]" />
  );

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  const handleChangeNetwork = () => {
    if (!chainId) return;
    openPopup(SelectChainPopup);
    onClose();
  };

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      closeButtonStyle="!top-9"
      useTemplate={false}
    >
      <section className="px-6">
        <h3 className="font-bold pb-1">Wallet</h3>
        <div className="bg-black-2 rounded-lg flex flex-row justify-between items-center py-3 px-4 w-full my-3">
          <div className="flex flex-row gap-3">
            {WalletIcon && <WalletIcon className="w-10 h-10 rounded-full" />}
            <div className="flex flex-col">
              <h5 className="text-h5 font-bold">{walletInfo?.title}</h5>
              <p className="p1 text-black-7">
                {address && shortenAddress(address)}
              </p>
            </div>
          </div>
          <button
            className="rounded-full px-[6px] py-2 bg-black-1 flex flex-row items-center shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)]"
            onClick={handleChangeNetwork}
          >
            {chainIcon}
            {checkIsAvailableChain(chainId) ? (
              <p className="c1 font-medium pl-1">{CHAIN_NAME_MAP[chainId]}</p>
            ) : (
              <p className="c1 font-medium pl-1">Unsupported</p>
            )}
            <ChevronDownIcon className="w-4 h-4 stroke-black-12" />
          </button>
        </div>
      </section>
      <section className="py-5 px-6 gap-2 flex flex-row">
        <Button
          size="xl"
          color="secondary"
          onClick={() => copyToClipboard(address!)}
          className="whitespace-nowrap"
        >
          Copy Address
        </Button>
        <Button
          size="xl"
          color="primary"
          onClick={handleDisconnect}
          className="whitespace-nowrap"
        >
          Disconnect
        </Button>
      </section>
    </PopupTemplate>
  );
}
