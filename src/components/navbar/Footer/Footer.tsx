'use client';

import Socials from './Socials';
import OutLink from './OutLink';
import { usePathname } from '@/src/i18n/routing';
import { NO_FOOTER } from '@/src/lib/constants/routing';

export default function Footer() {
  const pathname = usePathname();
  if (NO_FOOTER.includes(pathname)) return null;
  return (
    <section className="absolute bottom-0 left-1/2 flex w-full max-w-[1008px] -translate-x-1/2 flex-col px-4 py-14 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <section className="pb-2 lg:pb-[80px]">
          <Socials />
          <p className="p1 mt-2">contact@gimswap.com</p>
          <p className="p1">Copyright 2024 Gimswap. All rights reserved.</p>
          <p className="mt-[16px] hidden text-[12px] font-normal leading-[16px] tracking-[-0.3px] text-black-6 lg:block">
            GimSwap is currently running as a beta service. Some features are
            experimental and subject to change.
          </p>
        </section>
      </div>
      <div className="flex flex-col gap-[30px] pb-4 pt-6 lg:flex-col-reverse lg:gap-6 lg:pb-0 lg:pt-2">
        <OutLink />
      </div>
      <p className="pb-8 pt-4 text-[12px] font-normal leading-[16px] tracking-[-0.3px] text-black-6 lg:hidden">
        GimSwap is currently running as a beta service.
        <br /> Some features are experimental and subject to change.
      </p>
    </section>
  );
}
