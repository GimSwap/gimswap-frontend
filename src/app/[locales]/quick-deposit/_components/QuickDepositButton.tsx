'use client';

import Chip from '@/src/components/Chip';
import Button from '@/src/components/Button';
import { WALLETS } from '@/src/lib/constants/wallets';
import { useAuth } from '@/src/lib/hook/useAuth';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';
import ConnectBinanceWalletPopup from './popups/ConnectBinanceWalletPopup';
import { useRouter } from '@/src/i18n/routing';
import { bsc } from 'viem/chains';
import useSwitchNetwork from '@/src/lib/hook/useSwitchNetwork';
import { useGetCurrentWallet } from '@/src/lib/hook/useGetCurrentWallet';
import PeopleIcon from '@/public/svg/people.svg';
import { useQuery } from '@tanstack/react-query';
import { fetchGetTXCount } from '@/src/lib/utils/api/swift/fetchGetTXCount';

export default function QuickDepositButton() {
  const t = useTranslations('quickDeposit');
  const router = useRouter();
  const { connect, isConnecting } = useAuth();
  const { isConnected, chainId } = useAccount();
  const { data: currentWallet } = useGetCurrentWallet();
  const { openPopup } = usePopupStore((state) => state);
  const { switchChain } = useSwitchNetwork();

  const { data: txCount } = useQuery({
    queryKey: ['txCount', chainId],
    queryFn: () => fetchGetTXCount({ chainId: chainId || bsc.id }),
    select: (data) => data.count,
  });

  const buttonState = () => {
    const binanceWallet = WALLETS.find((wallet) =>
      wallet.connectorId.includes('BinanceW3WSDK'),
    );

    if (!isConnected || !currentWallet)
      return {
        title: t('button.isDisconnected'),
        onClick: async () => {
          if (!binanceWallet) return;
          await connect(binanceWallet);
          router.push('/quick-deposit/transfer');
        },
      };

    if (!currentWallet?.id.toLowerCase().includes('binance'))
      return {
        title: t('button.isConnected'),
        onClick: () => openPopup(ConnectBinanceWalletPopup),
      };

    return {
      title: t('button.isConnected'),
      onClick: async () => {
        if (chainId !== bsc.id) {
          await switchChain(bsc.id);
        }
        router.push('/quick-deposit/transfer');
      },
    };
  };

  return (
    <section
      className="absolute bottom-0 pb-5 px-6 w-full bg-black-1"
      style={{ borderRadius: '1px' }}
    >
      <Button
        color="primary"
        size="xl"
        onClick={buttonState().onClick}
        disabled={isConnecting}
      >
        {isConnecting ? t('connecting') : buttonState().title}
      </Button>
      {(!currentWallet || !isConnected) && !isConnecting && (
        <Chip
          color="black"
          className="w-fit absolute top-0 left-10 whitespace-nowrap -translate-y-1/2"
        >
          {t('chip')}
        </Chip>
      )}
      <div className="pt-2 flex flex-row justify-center items-center gap-1">
        <PeopleIcon className=" stroke-purple-500" />
        <p className="p1">
          {t.rich('button.people', {
            count: () => <span>{txCount || 0}</span>,
            blue: (text) => <span className="text-purple-500">{text}</span>,
          })}
        </p>
      </div>
    </section>
  );
}
