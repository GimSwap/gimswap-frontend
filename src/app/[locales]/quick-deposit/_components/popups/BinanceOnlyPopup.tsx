import PopupTemplate from '@/src/components/PopupTemplate';
import BinanceWalletIcon from '@/public/svg/wallet/binance.svg';
import Button from '@/src/components/Button';
import { useAuth } from '@/src/lib/hook/useAuth';
import { useTranslations } from 'next-intl';

interface ConnectBinanceWalletPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function ConnectBinanceWalletPopup({
  open,
  onClose,
}: ConnectBinanceWalletPopupProps) {
  const t = useTranslations('quickDeposit.onlyBinanceWalletPopup');
  const { disconnect } = useAuth();
  const handleDisconnect = async () => {
    await disconnect();
    onClose();
  };
  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      useTemplate={false}
      showCloseButton
      closeButtonStyle="absolute top-6 right-6"
    >
      <section className="pt-6 flex flex-col items-center">
        <BinanceWalletIcon className="w-[58px] h-[58px] m-[7px] pb-4" />
        <h3 className="font-bold mb-2">{t('title')}</h3>
        <h5 className="font-medium text-black-8 text-center pb-5">
          {t.rich('content', {
            br: () => <br />,
          })}
        </h5>
        <section className="flex flex-row py-5 gap-2 w-full px-6">
          <Button
            color="secondary"
            size="xl"
            className="w-full"
            onClick={onClose}
          >
            {t('close')}
          </Button>
          <Button
            color="primary"
            size="xl"
            className="w-full"
            onClick={handleDisconnect}
          >
            {t('disconnect')}
          </Button>
        </section>
      </section>
    </PopupTemplate>
  );
}
