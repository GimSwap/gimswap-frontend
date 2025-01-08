import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { useEffect } from 'react';
import CloseIcon from '@/public/svg/close.svg';

interface InnerPopupTemplateProps {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
}

export default function InnerPopupTemplate({
  open,
  children,
  onClose,
  showCloseButton = false,
}: InnerPopupTemplateProps) {
  const { unmountPopup } = usePopupStore((state) => state);
  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    }
    document.addEventListener('animationend', ({ animationName }) => {
      if (animationName === 'innerPopupSlideOut' && !open) {
        unmountPopup(true);
      }
    });
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('animationend', () => {});
    };
  }, [open]);

  return (
    <div
      className="lg:overflow-hidden max-lg:bg-[rgba(33,33,33,0.3)] z-30 max-lg:z-50 max-lg:w-[100vw] max-lg:h-[100dvh] max-lg:left-0 max-lg:bottom-0 fixed lg:relative lg:w-fit lg:h-fit m-[0_auto] lg:rounded-b-2xl"
      onClick={onClose}
    >
      <div
        className={`fixed lg:relative bottom-0 lg:border lg:border-purple-500 lg:w-[360px] lg:rounded-b-2xl bg-black-1 h-auto w-full rounded-t-2xl flex flex-col max-w-[480px] max-lg:inset-x-0 max-lg:m-[0_auto] pt-9 px-6 ${
          open ? 'innerPopupSlideIn' : 'innerPopupSlideOut'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <CloseIcon
            className="absolute right-6 top-9 stroke-black-12 cursor-pointer z-50"
            onClick={onClose}
          />
        )}
        {children}
      </div>
    </div>
  );
}
