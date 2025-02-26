import PopupTemplate from '@/src/components/PopupTemplate';
import AmountToSendBox from './AmountToSendBox';
import Button from '@/src/components/Button';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/src/i18n/routing';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import GuidePopup from '../../_components/popups/GuidePopup';

interface TransferSuccessPopupProps {
  open: boolean;
  onClose: () => void;
  amount: string;
}

export default function TransferSuccessPopup({
  open,
  onClose,
  amount,
}: TransferSuccessPopupProps) {
  const t = useTranslations('quickDeposit.swapAndSend.transferSuccessPopup');
  const _t = useTranslations('quickDeposit.howToUse');
  const router = useRouter();
  const { openPopup } = usePopupStore((state) => state);
  const handleClose = () => {
    onClose();
    router.push('/quick-deposit');
  };

  const handleOpenGuidePopup = () => {
    openPopup(GuidePopup, {
      title: _t('howToSwapUSDT.title'),
      step: [
        {
          subtitle: _t('howToSwapUSDT.step1'),
        },
        {
          subtitle: _t('howToSwapUSDT.step2'),
        },
        {
          subtitle: _t('howToSwapUSDT.step3'),
        },
        {
          subtitle: _t('howToSwapUSDT.step4'),
        },
      ],
    });
  };
  return (
    <PopupTemplate
      open={open}
      onClose={handleClose}
      icon="success"
      showCloseButton
    >
      <section className="flex flex-col justify-center items-center px-6">
        <h3 className="font-bold pt-4 pb-2">{t('title')}</h3>
        <h5 className="font-medium text-center">
          {t.rich('description', {
            br: () => <br />,
          })}
        </h5>
        <AmountToSendBox amount={amount} className="mt-4 mb-5" />
        <section className="flex flex-row gap-2 py-5 w-full">
          <Button
            size="xl"
            color="secondary"
            className="whitespace-nowrap"
            onClick={handleOpenGuidePopup}
          >
            {t('howToMoveUSDT')}
          </Button>
          <Button
            size="xl"
            color="primary"
            className="whitespace-nowrap"
            onClick={handleClose}
          >
            {t('confirm')}
          </Button>
        </section>
      </section>
    </PopupTemplate>
  );
}
