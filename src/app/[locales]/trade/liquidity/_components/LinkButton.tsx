'use client';

import { Link } from '@/src/i18n/routing';
import Image, { StaticImageData } from 'next/image';

interface LinkButtonProps {
  icon: StaticImageData;
  title: string;
  href: string;
  subtitle: string;
}

export default function LinkButton({
  title,
  href,
  icon,
  subtitle,
}: LinkButtonProps) {
  return (
    <Link
      target="_blank"
      href={href}
      className="px-4 py-3 rounded-lg border border-black-4 flex flex-row w-full items-center"
    >
      <div className="flex flex-row gap-3 ">
        <div className="w-11 h-11 relative rounded-full grid place-items-center">
          <Image src={icon} alt={title} />
        </div>
        <div className="flex flex-col">
          <h5 className="font-bold text-black-8">{title}</h5>
          <p className="p1 text-black-7">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
