import { WALLETS } from '@/src/lib/constants/wallets';
import PopupTemplate from '../PopupTemplate';
import { useState } from 'react';
import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import loadingLottie from '@/public/lottie/loading.json';
import Lottie from 'lottie-react';
import { WALLET_ICONS_URL } from '@/src/lib/constants/walletIcons';
import AlertToast from '@/src/components/toast/Toast';
import { useTranslations } from 'next-intl';

interface QrCodePopupProps {
  wallet: (typeof WALLETS)[number];
  onClose: () => void;
  open: boolean;
  reset: () => void;
  connect: () => void;
}

export default function QrCodePopup({
  onClose,
  open,
  wallet,
  reset,
  connect,
}: QrCodePopupProps) {
  const t = useTranslations('quickDeposit.common.alertServiceNotResponding');
  const [qrCodeUri, setQrCodeUri] = useState<string | undefined>(undefined);
  const [isAlertToastOpen, setIsAlertToastOpen] = useState(false);
  const WalletIcon = WALLET_ICONS_URL[wallet.title];

  const fetchQrCode = async () => {
    const newUri = await wallet.qrCode;
    setQrCodeUri(newUri);
  };

  useEffect(() => {
    fetchQrCode();

    const timer = setTimeout(() => {
      setIsAlertToastOpen(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, [qrCodeUri]);

  return (
    <PopupTemplate
      onClose={() => {
        reset();
        onClose();
      }}
      open={open}
      showCloseButton
      useTemplate={false}
      closeButtonStyle="top-9"
    >
      <section className="px-6">
        <h3 className="font-bold">Scan the QR Code</h3>
        <section className="pt-4 pb-5 flex flex-col gap-4 items-center justify-center">
          {qrCodeUri ? (
            <QRCodeSVG
              value={qrCodeUri}
              className="w-[196px] h-[196px]"
              imageSettings={{
                src: WalletIcon,
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: false,
              }}
            />
          ) : (
            <Lottie
              animationData={loadingLottie}
              loop
              className="h-16 w-16 py-[66px]"
            />
          )}
          <section className="p-4 flex flex-col gap-[6px] bg-black-3 rounded-lg w-full">
            <h5 className="font-medium text-black-8 text-center">
              1. Open {wallet.title}
            </h5>
            <h5 className="font-medium text-black-8 text-center">
              2. Please scan the QR code
            </h5>
          </section>
          <h5 className="font-medium text-black-6 text-center">
            Proceed in your wallet
          </h5>
        </section>
      </section>
      <AlertToast
        message={t('title')}
        actionText={t('refresh')}
        open={isAlertToastOpen}
        onClick={async () => {
          setQrCodeUri(undefined);
          connect();
          fetchQrCode();
          setIsAlertToastOpen(false);
        }}
      />
    </PopupTemplate>
  );
}
