import PopupTemplate from '@/src/components/PopupTemplate';
import { useRouter, usePathname } from '@/src/i18n/routing';
import { useLocale } from 'next-intl';

interface TranslationPopupProps {
  open: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ko', label: '한국어' },
] as const;

export default function TranslationPopup({
  open,
  onClose,
}: TranslationPopupProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleSelectLanguage = (langCode: string) => {
    if (langCode !== currentLocale) {
      router.push(pathname, { locale: langCode });
    }
    onClose();
  };

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      useTemplate={false}
    >
      <section className="px-6 py-4">
        <h3 className="-mt-7 font-bold">언어 설정</h3>
        <div className="mb-4 mt-4 flex flex-col gap-3">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className={`flex h-[60px] cursor-pointer flex-row items-center justify-between rounded-lg border bg-black-2 px-4 py-2 ${
                currentLocale === lang.code
                  ? 'border-purple-500'
                  : 'border-black-4'
              }`}
              onClick={() => handleSelectLanguage(lang.code)}
            >
              <p className="p1">{lang.label}</p>
            </div>
          ))}
        </div>
      </section>
    </PopupTemplate>
  );
}
