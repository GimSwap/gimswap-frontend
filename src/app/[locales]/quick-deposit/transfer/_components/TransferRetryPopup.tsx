import Button from '@/src/components/Button';
import PopupTemplate from '@/src/components/PopupTemplate';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';

interface TransferRetryPopupProps {
  open: boolean;
  onClose: () => void;
  amount: string;
}

export default function TransferRetryPopup({
  open,
  onClose,
  amount,
}: TransferRetryPopupProps) {
  const t = useTranslations('quickDeposit.swapAndSend.transferRetryPopup');
  const queryClient = useQueryClient();
  const { address } = useAccount();

  return (
    <PopupTemplate open={open} onClose={onClose} icon="alert" showCloseButton>
      <section className="flex flex-col justify-center items-center px-6">
        <h3 className="font-bold pt-4 pb-2">{t('title')}</h3>
        <h5 className="font-medium text-center mb-5">
          {t.rich('description', { br: () => <br /> })}
        </h5>
        <Button
          size="xl"
          color="primary"
          className="w-full my-5"
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ['quote', (+amount * 10000).toString(), address],
            });
            onClose();
          }}
        >
          {t('retry')}
        </Button>
      </section>
    </PopupTemplate>
  );
}
