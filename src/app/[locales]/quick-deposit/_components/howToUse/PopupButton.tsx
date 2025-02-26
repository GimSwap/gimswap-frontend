'use client';

import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import GuidePopup from '../popups/GuidePopup';
import CircleQuestionResizable from '@/public/svg/circle-question-white.svg';
import React from 'react';
import { useTranslations } from 'next-intl';

interface PopupButtonProps {
  children: React.ReactNode;
  type: 'createBinanceWallet' | 'swapUSDT';
}

export default function PopupButton({ children, type }: PopupButtonProps) {
  const { openPopup } = usePopupStore((state) => state);
  const t = useTranslations('quickDeposit.howToUse');
  const handleClick = () => {
    switch (type) {
      case 'createBinanceWallet':
        openPopup(GuidePopup, {
          title: t('howToCreateBinanceWalletPopup.title'),
          step: [
            {
              subtitle: t('howToCreateBinanceWalletPopup.step1'),
            },
            {
              subtitle: t('howToCreateBinanceWalletPopup.step2'),
            },
            {
              subtitle: t('howToCreateBinanceWalletPopup.step3'),
            },
            {
              subtitle: t('howToCreateBinanceWalletPopup.step4'),
            },
            {
              subtitle: t('howToCreateBinanceWalletPopup.step5'),
            },
          ],
        });
        break;
      case 'swapUSDT':
        openPopup(GuidePopup, {
          title: t('howToSwapUSDT.title'),
          step: [
            {
              subtitle: t('howToSwapUSDT.step1'),
            },
            {
              subtitle: t('howToSwapUSDT.step2'),
            },
            {
              subtitle: t('howToSwapUSDT.step3'),
            },
            {
              subtitle: t('howToSwapUSDT.step4'),
            },
          ],
        });
        break;
    }
  };

  return (
    <section
      className="px-3 py-2 rounded-lg bg-black-7 flex flex-row justify-between cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <CircleQuestionResizable className="w-5 h-[20px]" />
        <p className="p1 text-white-100 text-black-1">{children}</p>
      </div>
      <span className="p1 font-medium text-black-1">{t('more')}</span>
    </section>
  );
}
