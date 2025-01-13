'use client';

import { UrlObject } from 'url';
import { Link } from '@/src/i18n/routing';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string | UrlObject;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: () => void;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  color: 'primary' | 'secondary';
}

export default function Button({
  children,
  className,
  href,
  target,
  onClick,
  disabled,
  size,
  color,
}: ButtonProps) {
  const buttonSize = {
    xs: 'px-3 py-[6px] text-p1',
    sm: 'px-4 py-2 text-p1',
    md: 'px-4 py-[10px] text-h5',
    lg: 'px-4 py-3 text-h5',
    xl: 'px-6 py-[14px] text-h4',
  };

  const buttonColor = {
    primary: disabled
      ? 'bg-black-5 text-black-1'
      : 'bg-purple-500 text-black-1',
    secondary: disabled
      ? 'bg-black-4 text-black-7'
      : 'bg-purple-50 text-purple-500',
    black: disabled ? 'bg-black-5 text-black-1' : 'bg-black-1 text-black-1',
  };

  if (href)
    return (
      <Link
        href={href}
        className={`${buttonSize[size]} ${buttonColor[color]} rounded-lg font-bold w-full text-center whitespace-nowrap ${className}`}
        target={target}
        onClick={() => !disabled && onClick?.()}
      >
        {children}
      </Link>
    );
  return (
    <button
      onClick={() => !disabled && onClick?.()}
      className={`${buttonSize[size]} ${buttonColor[color]} rounded-lg font-bold w-full text-center ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
