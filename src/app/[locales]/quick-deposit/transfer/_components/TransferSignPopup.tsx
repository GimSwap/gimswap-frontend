import Button from '@/src/components/Button';
import PopupTemplate from '@/src/components/PopupTemplate';
import AlertToast from '@/src/components/toast/Toast';
import { WALLET_ICONS } from '@/src/lib/constants/walletIcons';
import { useGetCurrentWallet } from '@/src/lib/hook/useGetCurrentWallet';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface TransferSignPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function TransferSignPopup({ open, onClose }: TransferSignPopupProps) {
  const t = useTranslations('quickDeposit.buyOv.transferSignPopup');
  const _t = useTranslations('quickDeposit.common.alertServiceNotResponding');
  const { data: currentWallet } = useGetCurrentWallet();
  const [isAlertToastOpen, setIsAlertToastOpen] = useState(false);

  const BinanceWalletIcon = currentWallet
    ? WALLET_ICONS[currentWallet.id]
    : null;

  useEffect(() => {
    setTimeout(() => {
      setIsAlertToastOpen(true);
    }, 20000);
  }, []);

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      icon="loading"
      showCloseButton
    >
      {BinanceWalletIcon && (
        <BinanceWalletIcon className="w-[33px] h-[33px] absolute top-[67px] left-1/2 -translate-x-1/2" />
      )}
      <section className="flex flex-col px-6 items-center justify-center ">
        <h3 className="font-bold mt-4">{t('title')}</h3>
        <h5 className="font-medium text-black-8 text-center mt-2 mb-5">
          {t.rich('description', {
            br: () => <br />,
          })}
        </h5>
        <Button className="w-full my-5" size="xl" color="primary" disabled>
          {t('confirmButton')}
        </Button>
      </section>
      <AlertToast
        message={_t('title')}
        actionText={_t('refresh')}
        open={isAlertToastOpen}
      />
    </PopupTemplate>
  );
}
