import { defaultChain, KRWO, USDT } from '@/src/lib/constants/token';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { insertComma } from '@/src/lib/utils/insertComma';
import { useAccount } from 'wagmi';

interface TotalAddProps {
  mode: 'auto' | 'normal';
  KRWOAmount: string;
  USDTAmount: string;
  totalAmount: string;
  userInputTokenAmount: {
    KRWO: string;
    USDT: string;
  };
  title: string;
}

export default function TotalAdd({
  mode,
  KRWOAmount,
  USDTAmount,
  totalAmount,
  userInputTokenAmount,
  title,
}: TotalAddProps) {
  const { chainId } = useAccount();
  const KRWOIcon = KRWO.icon[chainId as ChainIdType];
  return (
    <div className="flex flex-col rounded-lg bg-black-3 px-4 py-3 gap-2 w-full">
      <div className="flex flex-row justify-between items-center">
        <p className="p1">{title}</p>
        <h5 className="font-bold">
          ₩ {insertComma(formatNumber(totalAmount, 0))}
        </h5>
      </div>
      <div className="pl-2 flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-1">
            <KRWOIcon className="w-5 h-5" />
            <p className="p1">{KRWO.name}</p>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <p className="p1 font-medium">
              {mode === 'auto' &&
                `${insertComma(userInputTokenAmount.KRWO || '0')} →`}
            </p>
            <p className="p1 font-medium">
              {insertComma(
                formatNumber(applyDecimals(KRWOAmount, KRWO.decimal)),
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-1">
            <USDT.icon className="w-5 h-5" />
            <p className="p1">{USDT.name}</p>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <p className="p1 font-medium">
              {mode === 'auto' && `${userInputTokenAmount.USDT} →`}
            </p>
            <p className="p1 font-medium">
              {insertComma(
                formatNumber(
                  applyDecimals(
                    USDTAmount,
                    USDT.decimal[
                      checkIsAvailableChain(chainId) ? chainId : defaultChain.id
                    ],
                  ),
                  2,
                ),
              )}
            </p>
          </div>
        </div>
        {mode === 'auto' && (
          <p className="c1 text-purple-500 text-end">Auto Swap is applied</p>
        )}
      </div>
    </div>
  );
}
