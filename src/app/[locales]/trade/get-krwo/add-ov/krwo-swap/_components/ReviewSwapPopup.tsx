import PopupTemplate from '@/src/components/PopupTemplate';
import { insertComma } from '@/src/lib/utils/insertComma';
import { useAccount } from 'wagmi';
import ArrowDownIcon from '@/public/svg/arrow/arrow-narrow-down.svg';
import Button from '@/src/components/Button';
import TokenIcon from '@/src/components/TokenIcon';
import { useApproveMax } from '@/src/lib/hook/useApproveMax';
import { GetSwapRouteResponseType } from '@/src/lib/types/api/swap/GetSwapRouteType';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { useState } from 'react';
import ButtonLoading from '@/src/components/ButtonLoading';

interface ReviewTokenType {
  symbol: string;
  amount: string;
  value: string;
  contractAddress?: string;
}
interface ReviewSwapPopupProps {
  onClose: () => void;
  open: boolean;
  tokens: {
    pay: ReviewTokenType;
    receive: ReviewTokenType;
  };
  priceRatio: number;
  isServiceFeeActive: boolean;
  serviceFee: string;
  swap: () => void;
  needApprove?: boolean;
  routes?: GetSwapRouteResponseType;
}

export default function ReviewSwapPopup({
  onClose,
  open,
  tokens,
  priceRatio,
  isServiceFeeActive,
  serviceFee,
  swap,
  needApprove,
  routes,
}: ReviewSwapPopupProps) {
  const { chainId } = useAccount();
  const { approveMax, isPending: isApprovePending } = useApproveMax();

  const [isApproved, setIsApproved] = useState(!needApprove);

  const handleApproveMax = async () => {
    if (
      !checkIsAvailableChain(chainId) ||
      !routes ||
      !tokens.pay.contractAddress
    )
      return;
    const status = await approveMax(
      chainId,
      tokens.pay.contractAddress,
      routes.contractAddress,
    );

    if (status.status === 'success') {
      setIsApproved(true);
    }
  };

  return (
    <PopupTemplate
      onClose={onClose}
      open={open}
      useTemplate={false}
      showCloseButton
      closeButtonStyle="top-9"
    >
      <section className="flex flex-col gap-2 px-6">
        <h3 className="font-bold">Review Swap</h3>
        {needApprove && (
          <section className="flex flex-col">
            <div className="flex flex-row gap-1">
              <div className="grid place-items-center p1 text-black-1 bg-black-8 rounded-full w-5 h-[20px]">
                1
              </div>
              <p className="p1 font-medium">Approve {tokens.pay.symbol}.</p>
            </div>
            <Button
              size="xl"
              color="primary"
              className="w-full mt-4 grid place-items-center min-h-[54px]"
              onClick={handleApproveMax}
              disabled={isApproved}
            >
              {isApprovePending ? (
                <ButtonLoading />
              ) : (
                <>Enable {tokens.pay.symbol}</>
              )}
            </Button>
            <div className="flex flex-row gap-1 pt-6">
              <div className="grid place-items-center p1 text-black-1 bg-black-8 rounded-full w-5 h-[20px]">
                2
              </div>
              <p className="p1 font-medium">
                Review the follow information and swap.
              </p>
            </div>
          </section>
        )}
        <section className="flex flex-col my-3 p-4 gap-[6px] bgl-black-3 items-center justify-center bg-black-3 rounded-lg">
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-col gap-[2px]">
              <h3 className="font-bold">{tokens.pay.amount}</h3>
              <p className="c1">₩ {insertComma(tokens.pay.value)}</p>
            </div>
            <div className="flex flex-row gap-1 items-center bg-black-1 rounded-full px-2 py-[6px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] h-[fit-content]">
              <TokenIcon
                symbol={tokens.pay.symbol}
                width={20}
                height={20}
                alt={tokens.pay.symbol}
                chainId={chainId}
              />
              <p className="p1 font-medium">{tokens.pay.symbol}</p>
            </div>
          </div>
          <ArrowDownIcon className="w-5 h-5 stroke-black-6 my-[6px]" />
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-col gap-[2px]">
              <h3 className="font-bold">{tokens.receive.amount}</h3>
              <p className="c1">₩ {insertComma(tokens.receive.value)}</p>
            </div>
            <div className="flex flex-row gap-1 items-center bg-black-1 rounded-full px-2 py-[6px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] h-[fit-content]">
              <TokenIcon
                symbol={tokens.receive.symbol}
                width={20}
                height={20}
                alt={tokens.receive.symbol}
                chainId={chainId}
              />
              <p className="p1 font-medium">{tokens.receive.symbol}</p>
            </div>
          </div>
        </section>
        <div className="flex flex-row justify-between">
          <p className="p1 text-black-8">Price</p>
          <p className="p1">
            1 {tokens.receive.symbol} = {priceRatio} {tokens.pay.symbol}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="p1 text-black-8">Gimswap fee</p>
          <p className="p1">Free</p>
        </div>
        {isServiceFeeActive && (
          <div className="flex flex-row justify-between">
            <p className="p1 text-black-8">Get Network Fee</p>
            <p className="p1">₩ {insertComma(serviceFee)}</p>
          </div>
        )}
        <Button
          size="xl"
          color="primary"
          className="my-5"
          onClick={swap}
          disabled={!isApproved}
        >
          Swap
        </Button>
      </section>
    </PopupTemplate>
  );
}
