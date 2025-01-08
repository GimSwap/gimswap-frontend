import InnerPopupTemplate from '@/src/components/popups/InnerPopupTemplate';
import { useLiquidityStore } from '@/src/lib/stores/liquidityStore/LiquidityStoreProvider';
import { useEffect, useState } from 'react';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import AddLiquidityReviewPopup from './addLiquidityReviewPopup/AddLiquidityReviewPopup';
import LiquidityInput from '../../../_components/addLiquidity/LiquidityInput';

interface AddRecommendLiquidityPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function AddRecommendLiquidityPopup({
  open,
  onClose,
}: AddRecommendLiquidityPopupProps) {
  const { selectedPosition } = useLiquidityStore((state) => state);

  const { openPopup } = usePopupStore((state) => state);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (selectedPosition) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [selectedPosition]);

  return (
    <InnerPopupTemplate open={open} onClose={onClose} showCloseButton>
      <div className={`${animate ? 'slideFromLeft' : ''}`}>
        <h3 className="font-bold text-2xl text-start top-0 h-7">
          Add Liquidity
        </h3>
        <LiquidityInput
          selectedPosition={selectedPosition!}
          onButtonClick={(mode, tokenAmount) =>
            selectedPosition &&
            openPopup(AddLiquidityReviewPopup, {
              mode,
              tokenAmount,
              ...selectedPosition,
            })
          }
        />
      </div>
    </InnerPopupTemplate>
  );
}
