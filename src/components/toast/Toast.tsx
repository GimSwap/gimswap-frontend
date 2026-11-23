import ExclamationCircleIcon from '@/public/svg/exclamation-circle.svg';

interface MinimumAmountToastProps {
  message: string;
  className?: string;
  onClick?: () => void;
  actionText?: string;
  open: boolean;
}

export default function AlertToast({
  message,
  className,
  onClick,
  actionText,
  open,
}: MinimumAmountToastProps) {
  if (!open) return null;

  return (
    <div
      className={`px-4 fixed bottom-5 z-50 left-1/2 items-center max-w-[432px] w-full slideUp ${className}`}
    >
      <div className="flex flex-row justify-between px-4 bg-black-8 py-[14px] rounded-lg w-full">
        <div className="flex flex-row gap-1">
          <ExclamationCircleIcon className="w-[20px] h-[20px]" />
          <p className="p1 text-black-1 font-medium text-nowrap">{message}</p>
        </div>
        {actionText && (
          <button
            className="p1 text-black-1 font-medium text-nowrap"
            onClick={() => (onClick ? onClick() : window.location.reload())}
          >
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
}
