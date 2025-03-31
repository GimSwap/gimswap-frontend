'use client';

import DepositTopBar from '@/src/components/navbar/DepositTopBar';
import DesktopTopbar from './DesktopTopbar';
import MobileNavbar from './MobileNavbar';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isDepositTopBar = pathname.includes('/quick-deposit');

  return (
    <>
      {isDepositTopBar ? (
        <DepositTopBar />
      ) : (
        <>
          <div>
            <DesktopTopbar />
          </div>
          <div className="block lg:hidden">
            <MobileNavbar />
          </div>
        </>
      )}
    </>
  );
}
