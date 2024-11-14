interface TooltipProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip({ children, className }: TooltipProps) {
  return (
    <div
      className={`absolute after:border-t-[0px] after:border-x-[5.5px] after:border-b-[7.5px] after:border-t-[transparent] after:border-x-[transparent] after:border-b-[rgba(20,20,20,0.6)] after:content-[""] after:absolute after:-top-[7.5px] ${className}`}
    >
      {children}
    </div>
  );
}
