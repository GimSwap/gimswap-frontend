const ChipStyle = {
  black: 'bg-black-12 text-black-1',
  purple: 'bg-purple-500 text-black-1',
  lightPurple: 'bg-purple-50 text-purple-500',
  lightGray: 'bg-black-5 text-black-1',
  gray: 'bg-black-6 text-black-1',
  blackOutline: 'bg-black-1 border border-black-12 text-black-12',
  purpleOutline: 'bg-black-1 border border-purple-500 text-purple-500',
};

interface ChipProps {
  color: keyof typeof ChipStyle;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Chip({
  color,
  children,
  onClick,
  className,
  disabled,
}: ChipProps) {
  return (
    <div
      className={`${ChipStyle[color]} c1 rounded-full px-2 py-1 font-medium flex flex-row flex-nowrap items-center justify-center ${className}`}
      onClick={() => !disabled && onClick?.()}
    >
      {children}
    </div>
  );
}
