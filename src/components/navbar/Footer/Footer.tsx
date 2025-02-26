'use client';

import LogoIcon from '@/public/svg/logo.svg';
import Socials from './Socials';
import OutLink from './OutLink';
import { usePathname } from '@/src/i18n/routing';
import { NO_FOOTER } from '@/src/lib/constants/routing';

export default function Footer() {
  const pathname = usePathname();
  if (NO_FOOTER.includes(pathname)) return null;
  return (
    <section className="absolute bottom-0 py-14 px-4 w-full max-w-[1008px] left-1/2 -translate-x-1/2 flex flex-col lg:flex-row lg:justify-between lg:items-start">
      <div>
        <LogoIcon className="invert" />
        <section className="pt-6 pb-2 lg:pb-[80px]">
          <p className="p1">contact@gimswap.com</p>
          <p className="p1">Copyright 2024 Gimswap. All rights reserved.</p>
        </section>
      </div>
      <div className="flex flex-col gap-[30px] lg:gap-6 lg:flex-col-reverse">
        <Socials />
        <OutLink />
      </div>
    </section>
  );
}
