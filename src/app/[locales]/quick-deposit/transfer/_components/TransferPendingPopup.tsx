import PopupTemplate from '@/src/components/PopupTemplate';
import AmountToSendBox from './AmountToSendBox';
import { useTranslations } from 'next-intl';
import AlertToast from '@/src/components/toast/Toast';
import { useEffect, useState } from 'react';

interface TransferPendingPopupProps {
  open: boolean;
  onClose: () => void;
  amount: string;
}

export default function TransferPendingPopup({
  open,
  onClose,
  amount,
}: TransferPendingPopupProps) {
  const t = useTranslations('quickDeposit.swapAndSend.swapPendingPopup');
  const _t = useTranslations('quickDeposit.common.alertServiceNotResponding');
  const [isAlertToastOpen, setIsAlertToastOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAlertToastOpen(true);
    }, 20000);
  }, []);

  return (
    <PopupTemplate
      open={open}
      onClose={() => {
        onClose();
      }}
      icon="loading"
      showCloseButton
    >
      <section className="flex flex-col justify-center items-center px-6">
        <h3 className="font-bold pt-4 pb-2">{t('title')}</h3>
        <h5 className="font-medium text-center">
          {t.rich('description', {
            br: () => <br />,
          })}
        </h5>
        <AmountToSendBox amount={amount} className="my-4" />
        <h5 className="text-black-6 font-medium pb-5">
          Proceed in your wallet
        </h5>
      </section>
      <AlertToast
        message={_t('title')}
        actionText={_t('refresh')}
        open={isAlertToastOpen}
      />
    </PopupTemplate>
  );
}
