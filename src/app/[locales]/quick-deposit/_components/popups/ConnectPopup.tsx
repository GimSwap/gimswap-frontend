import Button from '@/src/components/Button';
import PopupTemplate from '@/src/components/PopupTemplate';
import { WALLET_ICONS } from '@/src/lib/constants/walletIcons';
import { WALLETS } from '@/src/lib/constants/wallets';
import { useAuth } from '@/src/lib/hook/useAuth';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { fetchSendLog } from '@/src/lib/utils/api/fetchSendLog';
import { useTranslations } from 'next-intl';
import GuidePopup from './GuidePopup';
interface ConnectPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function ConnectPopup({ open, onClose }: ConnectPopupProps) {
  const { connect, isConnecting } = useAuth();
  const BinanceWalletIcon = WALLET_ICONS['Binance Wallet'];
  const _t = useTranslations('quickDeposit.howToUse');
  const t = useTranslations('quickDeposit.connectBinancePopup');

  const { openPopup } = usePopupStore((state) => state);
  const binanceWallet = WALLETS.find((wallet) =>
    wallet.connectorId.includes('BinanceW3WSDK'),
  );

  const handleConnect = async () => {
    if (!binanceWallet) {
      fetchSendLog({ name: 'binanceWalletNotFound' });
      return;
    }
    await connect(binanceWallet);
    onClose();
  };

  const handleOpenCreateGuidePopup = () => {
    openPopup(GuidePopup, {
      title: _t('howToCreateBinanceWalletPopup.title'),
      step: [
        {
          subtitle: _t('howToCreateBinanceWalletPopup.step1'),
        },
        {
          subtitle: _t('howToCreateBinanceWalletPopup.step2'),
        },
        {
          subtitle: _t('howToCreateBinanceWalletPopup.step3'),
        },
        {
          subtitle: _t('howToCreateBinanceWalletPopup.step4'),
        },
        {
          subtitle: _t('howToCreateBinanceWalletPopup.step5'),
        },
      ],
    });
  };

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      useTemplate={false}
      showCloseButton
      closeButtonStyle="absolute !top-6 !right-6"
    >
      <section className="pt-6 flex flex-col items-center px-6">
        <BinanceWalletIcon className="w-[58px] h-[58px] m-[7px]" />
        <h3 className="font-bold pt-4 pb-2">{t('title')}</h3>
        <h5 className="font-medium text-black-8 pb-5 text-center">
          {t.rich('content', {
            br: () => <br />,
          })}
        </h5>
        <section className="flex flex-row gap-2 py-5 w-full">
          <Button
            color="secondary"
            size="xl"
            className="w-full whitespace-nowrap"
            onClick={handleOpenCreateGuidePopup}
          >
            {t('openPopup')}
          </Button>
          <Button
            color="primary"
            size="xl"
            className="w-full whitespace-nowrap"
            disabled={isConnecting}
            onClick={handleConnect}
          >
            {isConnecting ? t('connecting') : t('connect')}
          </Button>
        </section>
      </section>
    </PopupTemplate>
  );
}
