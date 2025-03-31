import { insertComma } from '@/src/lib/utils/insertComma';
import ToggleButton from '@/src/components/ToggleButton';
import { useToolTip } from '@/src/lib/hook/useToolTip';
import CircleQuestionIcon from '@/public/svg/circle-question-gray.svg';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import GetNetworkFeePopup from '../GetNetworkFeePopup';

interface ReceiveAndSwapToggleBoxProps {
  isServiceFeeActive: boolean;
  setIsServiceFeeActive: React.Dispatch<React.SetStateAction<boolean>>;
  decimalAppliedServiceFee: string;
}

export default function ReceiveAndSwapToggleBox({
  isServiceFeeActive,
  setIsServiceFeeActive,
  decimalAppliedServiceFee,
}: ReceiveAndSwapToggleBoxProps) {
  const { openTooltip, Tooltip } = useToolTip();
  const { openPopup, closePopup } = usePopupStore((state) => state);
  const handleToggleButtonClick = () => {
    if (isServiceFeeActive) {
      setIsServiceFeeActive(false);
      return;
    }

    openPopup(GetNetworkFeePopup, {
      serviceFee: decimalAppliedServiceFee!,
      onApply: () => {
        setIsServiceFeeActive(true);
        closePopup(GetNetworkFeePopup);
      },
    });
  };

  return (
    <section className="px-4 py-3 rounded-lg border border-black-4 flex flex-col gap-1 w-full mb-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-1 items-center">
          <p className="font-bold text-black-8">Get Network fee</p>
          <p className="text-[8px] font-medium text-purple-500 rounded-full px-[6px] py-[3px] bg-purple-50">
            NEW
          </p>
        </div>
        <ToggleButton
          isActive={isServiceFeeActive}
          onClick={handleToggleButtonClick}
        />
      </div>
      <p className="c1 text-black-7">Paid with part of the swapped tokens.</p>
      {isServiceFeeActive && (
        <>
          <hr className="my-2 border-black-4" />
          <div className="flex flex-row justify-between text-black-8">
            <div className="flex flex-row gap-1 items-center">
              <p className="c1 text-black-7">Fee</p>
              <div className="relative">
                <CircleQuestionIcon
                  className="w-4 h-4 cursor-pointer"
                  onClick={openTooltip}
                />
                <Tooltip className="whitespace-nowrap bg-[rgba(0,0,0,0.5)] rounded-lg px-3 py-[6px] text-black-1 c1 after:left-[25%] -translate-x-[42px] translate-y-[11px]">
                  This is the fee incurred when
                  <br />
                  applying the 'Get Network fee'.
                </Tooltip>
              </div>
            </div>
            <p className="p1">₩ {insertComma(decimalAppliedServiceFee)}</p>
          </div>
        </>
      )}
    </section>
  );
}
