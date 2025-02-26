import Button from '@/src/components/Button';
import PopupTemplate from '@/src/components/PopupTemplate';
import { checkIsMobileDevice } from '@/src/lib/utils/checkIsMobileDevice';
import { useTranslations } from 'next-intl';

interface TransferSignPopupProps {
  open: boolean;
  onClose: () => void;
  handleOpenOpenVoucher: () => void;
}

export default function TransferSignSuccessPopup({
  open,
  onClose,
  handleOpenOpenVoucher,
}: TransferSignPopupProps) {
  const t = useTranslations('quickDeposit.buyOv.transferSignSuccessPopup');
  return (
    <PopupTemplate open={open} onClose={onClose} icon="success" showCloseButton>
      <section className="flex flex-col px-6 items-center justify-center ">
        <h3 className="font-bold">{t('title')}</h3>
        <h5 className="font-medium text-black-8 text-center mt-2 mb-5">
          {t.rich('description', {
            br: () => <br />,
          })}
        </h5>
        <Button
          className="w-full my-5"
          size="xl"
          color="primary"
          onClick={() => {
            if (checkIsMobileDevice()) handleOpenOpenVoucher();
            onClose();
          }}
        >
          {t('confirmButton')}
        </Button>
      </section>
    </PopupTemplate>
  );
}
