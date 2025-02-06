import PopupTemplate from '@/src/components/PopupTemplate';
import DisconnectIcon from '@/public/svg/disconnect.svg';
import { WALLETS } from '@/src/lib/constants/wallets';
import { useAuth } from '@/src/lib/hook/useAuth';
import { useAccount } from 'wagmi';
import { chains } from '@/src/lib/utils/wagmi';
import { CHAIN_ICONS } from '@/src/lib/constants/token';
import { useState } from 'react';
import type { Chain } from 'viem';

interface SelectWalletPopupProps {
  onClose: () => void;
  open: boolean;
  reloadOnConnect?: boolean;
  reloadOnDisconnect?: boolean;
}

export default function SelectWalletPopup({
  onClose,
  open,
  reloadOnConnect = true,
  reloadOnDisconnect = true,
}: SelectWalletPopupProps) {
  const { connect, disconnect } = useAuth();
  const { connector, isConnected } = useAccount();
  const [selectedChain, setSelectedChain] = useState<Chain>(chains[0]);
  return (
    <PopupTemplate
      onClose={onClose}
      open={open}
      useTemplate={false}
      showCloseButton
    >
      <section className="px-6 pb-3">
        <h3 className="font-bold text-black-12">Connect to Wallet</h3>
        <section className="flex flex-row gap-2 pt-3 pb-1">
          {chains.map((chain) => {
            const Icon = CHAIN_ICONS[chain.id];
            return (
              <button
                className={`px-2 py-[6px] rounded-full flex flex-row gap-1 items-center border ${selectedChain?.id === chain.id ? 'border-purple-500' : 'border-black-4'}`}
                onClick={() => setSelectedChain(chain)}
                key={chain.id}
              >
                <Icon className="w-5 h-5" />
                <p className="font-medium c1">{chain.name}</p>
              </button>
            );
          })}
        </section>
        <section className="flex flex-col py-3 gap-2">
          {WALLETS.map((wallet) => {
            if (wallet.unsupportedChainIds.includes(selectedChain.id))
              return null;
            const isCurrentWallet = connector?.name === wallet.title;
            return (
              <button
                onClick={async () => {
                  if (!selectedChain) return;
                  await connect(wallet, reloadOnConnect, selectedChain.id);
                  onClose();
                }}
                className={`bg-black-2 rounded-lg py-3 px-4 flex flex-row gap-3 items-center ${isCurrentWallet && 'border border-purple-500'}`}
                key={wallet.id[0]}
              >
                <wallet.icon className="w-10 h-10" />
                <div className="flex flex-col">
                  <h5 className="font-bold text-black-12 text-start">
                    {wallet.title}
                  </h5>
                  <h5 className="font-medium text-black-7 text-start">
                    {wallet.installed ? 'Available' : 'Install required'}
                  </h5>
                </div>
              </button>
            );
          })}
          {isConnected && (
            <button
              onClick={async () => {
                await disconnect(reloadOnDisconnect).then(() => onClose());
              }}
              className={`bg-black-2 rounded-lg py-3 px-4 flex flex-row gap-3 items-center`}
            >
              <DisconnectIcon />
              <div className="flex flex-col">
                <h5 className="font-bold text-black-12 text-start">
                  Disconnect
                </h5>
              </div>
            </button>
          )}
        </section>
      </section>
    </PopupTemplate>
  );
}
