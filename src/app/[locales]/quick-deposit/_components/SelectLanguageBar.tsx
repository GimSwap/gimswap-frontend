'use client';

import LanguageIcon from '@/public/svg/language.svg';
import ChevronDownIcon from '@/public/svg/chevron/down.svg';
import { useTopbarStore } from '@/src/lib/stores/topbarStore/TopbarStoreProvider';
import { useEffect } from 'react';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SelectLanguagePopup from '@/src/components/popups/SelectLanguagePopup';
import { useTranslations } from 'next-intl';

export default function SelectLanguageBar() {
  const t = useTranslations('quickDeposit.common');
  const { setInvert } = useTopbarStore((state) => state);
  const { openPopup } = usePopupStore((state) => state);

  useEffect(() => {
    setInvert(true);
  }, []);

  return (
    <section className="mt-[72px] flex flex-row justify-between bg-black-3 px-6 py-3">
      <div className="flex flex-row items-center gap-1">
        <LanguageIcon className="h-4 w-4 stroke-black-7" />
        <p className="p1 font-medium text-black-8">{t('selectLanguage')}</p>
      </div>
      <div
        className="flex cursor-pointer flex-row items-center gap-1"
        onClick={() => openPopup(SelectLanguagePopup)}
      >
        <p className="p1 font-medium text-black-8">{t('language')}</p>
        <ChevronDownIcon className="h-4 w-4 stroke-black-7" />
      </div>
    </section>
  );
}
