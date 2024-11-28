import { useState, useEffect, useRef } from "react";

interface TooltipProps {
  children: React.ReactNode;
  className?: string;
}

export const useToolTip = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const openTooltip = () => {
    setIsTooltipOpen(true);
  };

  const closeTooltip = () => {
    setIsTooltipOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        closeTooltip();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Tooltip = ({ children, className }: TooltipProps) => {
    if (!isTooltipOpen) return null;
    return (
      <div
        ref={tooltipRef}
        className={`absolute after:border-t-[0px] after:border-x-[5.5px] after:border-b-[7.5px] after:border-t-[transparent] after:border-x-[transparent] after:border-b-[rgba(20,20,20,0.6)] after:content-[""] after:absolute after:-top-[7.5px] ${className}`}
      >
        {children}
      </div>
    );
  };

  return { openTooltip, closeTooltip, Tooltip };
};
