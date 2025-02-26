import Button from '@/src/components/Button';
import PopupTemplate from '@/src/components/PopupTemplate';
import { useTranslations } from 'next-intl';

interface TransferMoveToOpenvoucherPopupProps {
  open: boolean;
}

export default function TransferMoveToOpenvoucherPopup({
  open,
}: TransferMoveToOpenvoucherPopupProps) {
  const t = useTranslations(
    'quickDeposit.buyOv.transferMoveToOpenVoucherPopup',
  );
  return (
    <PopupTemplate open={open} onClose={() => {}} icon="loading">
      <section className="flex flex-col items-center px-6">
        <h3 className="font-bold mt-4 mb-2">{t('title')}</h3>
        <h5 className="font-medium text-black-8 text-center pb-5">
          {t.rich('subtitle', {
            br: () => <br />,
          })}
        </h5>
        <Button className="w-full my-5" size="xl" color="primary" disabled>
          {t('button')}
        </Button>
      </section>
    </PopupTemplate>
  );
}
