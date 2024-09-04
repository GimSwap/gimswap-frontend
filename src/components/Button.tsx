import { UrlObject } from "url";
import { Link } from "../navigation";

interface ButtonProps {
  title: string;
  className?: string;
  href?: string | UrlObject;
  target?: React.HTMLAttributeAnchorTarget;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  title,
  className,
  href,
  target,
  onClick,
  disabled,
}: ButtonProps) {
  if (href)
    return (
      <Link
        href={href}
        className={`${className} py-[14px] px-6 rounded-lg font-bold w-full text-center`}
        target={target}
        onClick={() => !disabled && onClick?.()}
      >
        {title}
      </Link>
    );
  return (
    <button
      onClick={() => !disabled && onClick?.()}
      className={`${className} py-[14px] px-6 rounded-lg font-bold w-full text-center ${
        disabled && "!bg-black-5"
      }`}
      disabled={disabled}
    >
      {title}
    </button>
  );
}
