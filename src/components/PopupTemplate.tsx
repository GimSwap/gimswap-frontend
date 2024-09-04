import CloseIcon from "@/public/svg/close.svg";
import { useEffect } from "react";
import Lottie from "lottie-react";
import loadingLottie from "@/public/lottie/loading.json";
import successLottie from "@/public/lottie/success.json";
import failLottie from "@/public/lottie/fail.json";

const iconType = {
  loading: <Lottie animationData={loadingLottie} loop className="h-16 w-16" />,
  success: (
    <Lottie
      animationData={successLottie}
      loop={false}
      className="h-[72px] w-[72px] -translate-y-4"
    />
  ),
  error: (
    <Lottie
      animationData={failLottie}
      loop={false}
      className="h-[74px] w-[74px] -translate-y-4"
    />
  ),
};

export default function PopupTemplate({
  children,
  useTemplate = true,
  showCloseButton = false,
  onClose,
  icon,
  open,
}: {
  children?: React.ReactNode;
  useTemplate?: boolean;
  showCloseButton?: boolean;
  subTitle?: string;
  onClose: () => void;
  icon?: keyof typeof iconType;
  open: boolean;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div
      className="fixed top-0 w-[100vw] h-[100dvh] bg-[rgba(33,33,33,0.3)] z-50 max-w-maxSize"
      onClick={() => onClose()}
    >
      <div
        className={`fixed bottom-0 bg-black-1 h-auto w-full rounded-t-2xl flex items-center flex-col max-w-maxSize ${
          !open ? "slideOut" : "slideIn"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full">
          {useTemplate && (
            <div className="px-6 flex flex-col items-center pt-6 relative">
              <div className="mt-14">{icon && iconType[icon]}</div>
            </div>
          )}

          <div className={`${!useTemplate && "mt-9"}`}>
            {showCloseButton && (
              <CloseIcon
                className="absolute right-6 top-6"
                onClick={() => onClose()}
              />
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
