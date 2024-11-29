import { useState, useEffect, useRef, useCallback } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  className?: string;
  tailPosition?: 'top' | 'bottom';
}

interface UseToolTipProps<T> {
  closeOnClick?: boolean;
  dependency?: T;
}

export const useToolTip = <T,>(
  { closeOnClick, dependency }: UseToolTipProps<T> = { closeOnClick: true },
) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const openTooltip = useCallback(() => {
    setIsTooltipOpen(true);
  }, [dependency]);

  const closeTooltip = useCallback(() => {
    setIsTooltipOpen(false);
  }, [dependency]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        closeOnClick
      ) {
        closeTooltip();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClick]);

  const Tooltip = ({
    children,
    className,
    tailPosition = 'top',
  }: TooltipProps) => {
    const tailPositionClass = {
      top: 'speech-bubble-tail-top',
      bottom: 'speech-bubble-tail-bottom',
    };
    if (!isTooltipOpen) return <></>;
    return (
      <div
        ref={tooltipRef}
        className={`absolute ${tailPositionClass[tailPosition]} ${className}`}
      >
        {children}
      </div>
    );
  };

  return { openTooltip, closeTooltip, Tooltip };
};
