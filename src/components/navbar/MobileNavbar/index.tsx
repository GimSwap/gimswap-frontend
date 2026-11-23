'use client';

import { useEffect, useState } from 'react';
import { checkIsIphoneChrome } from '@/src/lib/utils/checkIsMobileBrowser';
import NavButtons from './NavButtons';

export default function MobileNavbar() {
  const [isIphoneChrome, setIsIphoneChrome] = useState(false);

  useEffect(() => {
    setIsIphoneChrome(checkIsIphoneChrome());
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 w-full bg-[#fff] px-3 pt-[9px]"
      style={{
        paddingBottom: isIphoneChrome ? '20px' : '9px',
      }}
    >
      <NavButtons />
    </div>
  );
}
