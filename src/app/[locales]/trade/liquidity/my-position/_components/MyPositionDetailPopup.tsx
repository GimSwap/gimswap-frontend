import InnerPopupTemplate from '@/src/components/popups/InnerPopupTemplate';
import PopupPagination from '@/src/components/popups/PopupPagination';
import MyPositionDetail from './myPositionDetail/MyPositionDetail';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import { useEffect, useState } from 'react';

interface MyPositionDetailPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function MyPositionDetailPopup({
  open,
  onClose,
}: MyPositionDetailPopupProps) {
  const [animate, setAnimate] = useState(false);

  const { selectedMyPosition } = useLiquidityStore((state) => state);

  useEffect(() => {
    if (selectedMyPosition) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [selectedMyPosition]);

  return (
    <InnerPopupTemplate open={open} onClose={onClose} showCloseButton>
      <div className={`${animate ? 'slideFromLeft' : ''}`}>
        <PopupPagination
          initialComponent={{
            component: MyPositionDetail,
          }}
        />
      </div>
    </InnerPopupTemplate>
  );
}
