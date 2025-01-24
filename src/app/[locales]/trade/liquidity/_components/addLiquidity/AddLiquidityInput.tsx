import CopyIcon from '@/public/svg/copy.svg';
import { TokenType } from '@/src/lib/types/TokenType';
import { insertComma } from '@/src/lib/utils/insertComma';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import BalanceIcon from '@/public/svg/balance.svg';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import LockedIcon from '@/public/svg/locked.svg';
import { useAccount } from 'wagmi';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { defaultChain } from '@/src/lib/constants/token';

interface AddLiquidityInputProps {
  token: Omit<TokenType, 'icon'> & { icon: React.ElementType };
  value: string;
  krwValue: string;
  focusedInput: string | null;
  setFocusedInput: (token: string | null) => void;
  balance: string;
  onChange: (token: string, value: string) => void;
  disabled: boolean;
  disablePlaceHolder: string;
}

export default function AddLiquidityInput({
  token,
  value,
  krwValue,
  focusedInput,
  setFocusedInput,
  balance,
  onChange,
  disabled,
  disablePlaceHolder,
}: AddLiquidityInputProps) {
  const { chainId } = useAccount();
  const decimal =
    typeof token.decimal === 'object'
      ? token.decimal[
          checkIsAvailableChain(chainId) ? chainId : defaultChain.id
        ]
      : token.decimal;

  const handleMaxButton = () => {
    !disabled &&
      onChange(
        token.symbol,
        safeCalc.divide(balance, 10 ** decimal).toString(),
      );
  };

  return (
    <section
      className={`w-full bg-black-3 rounded-lg p-4 flex flex-col border ${focusedInput === token.symbol ? 'border border-purple-500' : 'border-black-3'} z-10`}
      onClick={() => setFocusedInput(token.symbol)}
    >
      <div className="flex flex-row justify-between">
        <p className="c1 font-medium">You add</p>
        <div className="flex flex-row items-center gap-1">
          <div className="py-[6px] px-2 bg-black-1 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex gap-1 items-center">
            <token.icon className="w-5 h-5" />
            <p className="c1 font-medium">{token.name}</p>
          </div>
          <CopyIcon className="stroke-black-8 w-4 h-4 cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-row gap-[2px] pt-1 justify-end min-h-[14px]">
        {!disabled && (
          <>
            <p className="c0 text-black-8 flex flex-row items-center gap-1 pr-[2px]">
              <BalanceIcon className="w-[14px] h-[14px]" />
              {insertComma(
                formatNumber(
                  safeCalc.divide(balance, 10 ** decimal).toString(),
                  2,
                ),
              )}
            </p>
            <p
              className="c0 font-medium text-purple-500 cursor-pointer"
              onClick={handleMaxButton}
            >
              Max
            </p>
          </>
        )}
      </div>
      <input
        className="text-h2 font-bold placeholder:text-black-12"
        onChange={(e) => onChange(token.symbol, e.target.value)}
        value={disabled ? disablePlaceHolder : value}
        placeholder="0"
        disabled={disabled}
      />
      <div className="c1 text-black-8">
        {disabled ? (
          <div className="flex flex-row items-center gap-1">
            <LockedIcon className="w-4 h-4" />
            <p className="c1 text-black-6">
              Market price is outside the range.
            </p>
          </div>
        ) : (
          `₩ ${insertComma(formatNumber(krwValue || '0', 2))}`
        )}
      </div>
    </section>
  );
}
