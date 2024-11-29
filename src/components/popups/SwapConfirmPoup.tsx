import { EXCHANGE_RATE_DECIMAL_OV_TO_KRWO } from '@/src/lib/constants/token';
import Button from '../Button';
import PopupTemplate from '../PopupTemplate';
import { TokenType } from '@/src/lib/types/TokenType';
import { useSwap } from '@/src/lib/hook/useSwap';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { useEffect } from 'react';
import SwapLoadingPopup from './SwapLoadingPopup';
import SwapSuccessPopup from './SwapSuccessPopup';
import SwapErrorPopup from './SwapErrorPopup';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { insertComma } from '@/src/lib/utils/insertComma';

interface SwapConfirmPopupProps {
  open: boolean;
  onClose: () => void;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  fee: number | null;
  tokens: {
    receive: TokenType;
    pay: TokenType;
  };
  onComplete: () => void;
}

export default function SwapConfirmPopup({
  onClose,
  open,
  amount,
  setAmount,
  tokens,
  fee,
  onComplete,
}: SwapConfirmPopupProps) {
  const { swap, error, isPending, isSuccess, hash } = useSwap(
    tokens.pay,
    amount,
  );
  const { openPopup, closePopup } = usePopupStore((state) => state);

  useEffect(() => {
    if (isPending) {
      openPopup(SwapLoadingPopup, {
        tokens,
        amount,
        closePrevPopup: () => {
          closePopup(SwapLoadingPopup);
          onClose();
          openPopup(SwapErrorPopup);
        }
      });
      return;
    }

    if (isSuccess) {
      closePopup(SwapLoadingPopup);
      onClose();
      onComplete();
      setAmount('0');
      openPopup(SwapSuccessPopup, {
        tokens,
        amount,
        hash: hash!,
        closePrevPopup: onClose,
      });
      return;
    }

    if (error) {
      closePopup(SwapLoadingPopup);
      onClose();
      openPopup(SwapErrorPopup);
    }
  }, [isPending, isSuccess, error]);

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      useTemplate={false}
      showCloseButton
    >
      <div className="px-6">
        <h3 className="font-bold">Review Swap</h3>
        <section className="p-4 rounded-lg bg-black-2">
          <section className="mb-3">
            <p className="c1 mb-2">You pay</p>
            <h3 className="font-bold">
              {`${insertComma(
                safeCalc.divide(amount, tokens.pay.unit).toFixed(),
              )} ${tokens.pay.name}`}
            </h3>
            <p className="c1 stroke-black-8">
              {`₩ ${BigInt(amount).toLocaleString('ko-kr', {
                maximumFractionDigits: 14,
              })}`}
            </p>
            <hr className="text-black-5 my-3" />
            <p className="c1 mb-2">You receive</p>
            <h3 className="font-bold">
              {`${insertComma(
                safeCalc.divide(amount, tokens.receive.unit).toFixed(),
              )} ${tokens.receive.name}`}
            </h3>
            <p className="c1 text-black-8">
              {`₩ ${BigInt(amount).toLocaleString('ko-kr', {
                maximumFractionDigits: 14,
              })}`}
            </p>
          </section>
          <section className="flex flex-col">
            <div className="flex flex-row justify-between py-1">
              <p className="c1 font-medium">Rate</p>
              <p className="c1 font-medium">
                {`1 ${tokens.pay.name} = ${insertComma(
                  safeCalc.pow(10, EXCHANGE_RATE_DECIMAL_OV_TO_KRWO).toFixed(),
                )} ${tokens.receive.name}`}
              </p>
            </div>
            <div className="flex flex-row justify-between py-1">
              <p className="c1 font-medium">
                GimSwap Fee ({fee ? fee.toFixed(2) : '0.00'}%)
              </p>
              <p className={`c1 font-medium ${fee === 0 && 'text-purple-500'}`}>
                {fee === 0 ? 'Free' : fee}
              </p>
            </div>
          </section>
        </section>
        <Button
          title="Confirm swap"
          className="bg-purple-500 text-black-1 my-4"
          onClick={swap}
        />
      </div>
    </PopupTemplate>
  );
}
