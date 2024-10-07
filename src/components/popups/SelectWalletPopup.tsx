import PopupTemplate from '@/src/components/PopupTemplate';
import DisconnectIcon from '@/public/svg/disconnect.svg';
import { WALLETS } from '@/src/lib/constants/wallets';
import { useAuth } from '@/src/lib/hook/useAuth';
import { useAccount } from 'wagmi';

interface SelectWalletPopupProps {
  onClose: () => void;
  open: boolean;
}

export default function SelectWalletPopup({
  onClose,
  open,
}: SelectWalletPopupProps) {
  const { connect, disconnect } = useAuth();
  const { connector, isConnected } = useAccount();
  return (
    <PopupTemplate
      onClose={onClose}
      open={open}
      useTemplate={false}
      showCloseButton
    >
      <section className="px-6 pb-3">
        <h3 className="font-bold text-black-12">Connect to Wallet</h3>
        <section className="flex flex-col py-3 gap-2">
          {WALLETS.map((wallet) => {
            const isCurrentWallet = connector?.name === wallet.title;
            return (
              <button
                onClick={async () => {
                  await connect(wallet).then(() => onClose());
                }}
                className={`bg-black-2 rounded-lg py-3 px-4 flex flex-row gap-3 items-center ${isCurrentWallet && 'border border-purple-500'}`}
                key={wallet.id}
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
                await disconnect().then(() => onClose());
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
