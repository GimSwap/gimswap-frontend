'use client';

import Chip from '@/src/components/Chip';
import Button from '@/src/components/Button';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';
import BinanceOnlyPopup from './popups/BinanceOnlyPopup';
import { useRouter } from '@/src/i18n/routing';
import { bsc } from 'viem/chains';
import useSwitchNetwork from '@/src/lib/hook/useSwitchNetwork';
import { useGetCurrentWallet } from '@/src/lib/hook/useGetCurrentWallet';
import PeopleIcon from '@/public/svg/people.svg';
import { useQuery } from '@tanstack/react-query';
import { fetchGetTXCount } from '@/src/lib/utils/api/swift/fetchGetTXCount';
import ConnectPopup from './popups/ConnectPopup';

export default function QuickDepositButton() {
  const t = useTranslations('quickDeposit');
  const router = useRouter();
  const { isConnected, chainId } = useAccount();
  const { data: currentWallet } = useGetCurrentWallet();
  const { openPopup } = usePopupStore((state) => state);
  const { switchChain } = useSwitchNetwork();

  const { data: txCount } = useQuery({
    queryKey: ['txCount', chainId],
    queryFn: () => fetchGetTXCount({ chainId: bsc.id }),
    select: (data) => data.count,
  });

  const buttonState = () => {
    if (!isConnected || !currentWallet)
      return {
        title: t('button.isConnected'),
        onClick: () => {
          openPopup(ConnectPopup);
        },
      };

    if (!currentWallet?.id.toLowerCase().includes('binance'))
      return {
        title: t('button.isConnected'),
        onClick: () => openPopup(BinanceOnlyPopup),
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
      <Button color="primary" size="xl" onClick={buttonState().onClick}>
        {buttonState().title}
      </Button>
      {(!currentWallet || !isConnected) && (
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
