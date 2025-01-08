import ChevronLeftIcon from '@/public/svg/chevron/left.svg';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import MyPositionAddLiquidityReviewPopup from './MyPositionAddLiquidityReviewPopup';
import LiquidityInput from '../../../../_components/addLiquidity/LiquidityInput';
import { USDT } from '@/src/lib/constants/token';
import { KRWO } from '@/src/lib/constants/token';
import { MyPositionType } from '@/src/lib/types/api/liquidity/GetPositionType';

interface MyPositionAddLiquidityPopupProps {
  prev: () => void;
  selectedMyPosition: MyPositionType;
  totalAmount: string;
  currentPrice: number;
}

export default function MyPositionAddLiquidityPopup({
  prev,
  selectedMyPosition,
  totalAmount,
  currentPrice,
}: MyPositionAddLiquidityPopupProps) {
  const { openPopup } = usePopupStore((state) => state);

  return (
    <section className="max-lg:h-[95dvh] relative overflow-y-scroll scrollbar-hide">
      <div className="flex flex-row gap-1 items-center">
        <ChevronLeftIcon className="w-6 h-6 stroke-black-12" onClick={prev} />
        <h3 className="font-bold">Add</h3>
      </div>
      <LiquidityInput
        selectedPosition={{
          apr: selectedMyPosition.apr,
          currentPrice: currentPrice,
          lowerTick: selectedMyPosition.liquidity.lowerTick,
          upperTick: selectedMyPosition.liquidity.upperTick,
        }}
        onButtonClick={(mode, tokenAmount) =>
          openPopup(MyPositionAddLiquidityReviewPopup, {
            mode,
            tokens: [
              {
                ...KRWO,
                amount: tokenAmount.KRWO,
              },
              {
                ...USDT,
                amount: tokenAmount.USDT,
              },
            ],
            selectedMyPosition,
            totalAmount,
            currentPrice,
          })
        }
      />
    </section>
  );
}
