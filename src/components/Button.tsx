import { UrlObject } from "url";
import { Link } from "../navigation";

interface ButtonProps {
  title: string;
  className?: string;
  link?: boolean;
  href?: string | UrlObject;
  target?: React.HTMLAttributeAnchorTarget;
}

export default function Button({
  title,
  className,
  link,
  href,
  target,
}: ButtonProps) {
  if (link)
    return (
      <Link
        href={href!}
        className={`${className} py-[14px] px-6 rounded-lg font-bold w-full text-center`}
        target={target}
      >
        {title}
      </Link>
    );
  return (
    <button
      className={`${className} py-[14px] px-6 rounded-lg font-bold w-full text-center`}
    >
      {title}
    </button>
  );
}
