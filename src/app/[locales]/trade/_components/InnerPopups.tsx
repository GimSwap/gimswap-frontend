'use client';

import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function InnerPopups() {
  const { innerPopups, clearPopups } = usePopupStore((state) => state);
  const { chainId } = useAccount();

  const pathname = usePathname();
  useEffect(() => {
    clearPopups(true);
  }, [pathname, chainId]);

  return (
    <>
      {innerPopups.map(({ Component, props }) => (
        <div
          id={`popup-${Component.name}`}
          key={Component.name}
          className="max-lg:mx-[-8px]"
        >
          <Component {...props} />
        </div>
      ))}
    </>
  );
}
