import PopupTemplate from '../PopupTemplate';
import { routing, usePathname, useRouter } from '@/src/i18n/routing';
import { useLocale } from 'next-intl';

interface SelectLanguagePopupProps {
  open: boolean;
  onClose: () => void;
}

export default function SelectLanguagePopup({
  open,
  onClose,
}: SelectLanguagePopupProps) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const localeMap = {
    en: 'English',
    ko: '한국어',
  };

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      useTemplate={false}
      closeButtonStyle="absolute top-9 right-6"
    >
      <section className="px-6 gap-2 pb-5">
        <h3 className="font-bold pb-1 ">언어 설정</h3>
        <div className="flex flex-col gap-2 py-3">
          {routing.locales.map((locale) => {
            const isActive = locale === currentLocale;
            return (
              <button
                className={`px-4 py-[18px] text-h5 text-start font-medium rounded-lg bg-black-2 border ${
                  isActive ? 'border-purple-500' : 'border-black-2'
                }`}
                onClick={() => {
                  router.replace(pathname, { locale });
                }}
                key={locale}
              >
                {localeMap[locale]}
              </button>
            );
          })}
        </div>
      </section>
    </PopupTemplate>
  );
}
