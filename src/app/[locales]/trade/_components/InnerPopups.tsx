'use client';

import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function InnerPopups() {
  const { innerPopups, clearPopups } = usePopupStore((state) => state);
  const pathname = usePathname();
  useEffect(() => {
    clearPopups(true);
  }, [pathname]);
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
