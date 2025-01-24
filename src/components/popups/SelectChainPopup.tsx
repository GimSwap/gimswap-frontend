import { chains } from '@/src/lib/utils/wagmi';
import PopupTemplate from '../PopupTemplate';
import { CHAIN_ICONS, CHAIN_NAME_MAP } from '@/src/lib/constants/token';
import ExclamationIcon from '@/public/svg/exclamation.svg';
import useSwitchNetwork from '@/src/lib/hook/useSwitchNetwork';
import { useAccount } from 'wagmi';
import { Chain } from 'wagmi/chains';
import { WALLETS } from '@/src/lib/constants/wallets';

interface SelectChainPopup {
  open: boolean;
  onClose: () => void;
}

export default function SelectChainPopup({ open, onClose }: SelectChainPopup) {
  const { chainId, connector } = useAccount();
  const isUnsupportedChain = !chains.find((chain) => chain.id === chainId);
  const { switchChain } = useSwitchNetwork();
  const handleSwitchChain = (chain: Chain) => {
    switchChain(chain.id);
    onClose();
  };

  const currentWallet = WALLETS.find(
    (wallet) => wallet.connectorId === connector?.id,
  );

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      closeButtonStyle="!top-9"
      useTemplate={false}
    >
      <section className="px-6">
        <h3 className="font-bold">Switch Network</h3>
        <div className="flex flex-col gap-2 py-3">
          {chains.map((chain) => {
            const ChainIcon = CHAIN_ICONS[chain.id];
            const isSelected = chainId === chain.id;
            if (
              currentWallet?.unsupportedChainIds.includes(chain.id) &&
              !isSelected
            )
              return;
            return (
              <button
                key={chain.id}
                onClick={() => handleSwitchChain(chain)}
                className={`flex flex-row gap-3 items-center py-3 px-4 bg-black-2 rounded-lg border ${
                  isSelected ? 'border-purple-500' : 'border-black-2'
                }`}
              >
                <ChainIcon className="w-10 h-10 rounded-full" />
                <h5 className="font-medium">{CHAIN_NAME_MAP[chain.id]}</h5>
              </button>
            );
          })}
          {isUnsupportedChain && (
            <div className="flex flex-row gap-3 items-center py-3 px-4 bg-black-2 border border-purple-500 rounded-lg">
              <ExclamationIcon className="w-10 h-10 rounded-full bg-[#FDEDED]" />
              <h5 className="font-medium">Unsupported</h5>
            </div>
          )}
        </div>
      </section>
    </PopupTemplate>
  );
}
