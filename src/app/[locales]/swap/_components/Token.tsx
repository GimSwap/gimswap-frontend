import { OPEN_VOUCHER, KRWO } from '@/src/lib/constants/token';
import { getBalance } from '@/src/lib/hook/useGetBalance';
import { useEffect } from 'react';
import { insertComma } from '@/src/lib/utils/insertComma';
import { safeCalc } from '@/src/lib/utils/safeCalc';

interface TokenProps {
  type: 'pay' | 'receive';
  amount: string;
  setAmount?: React.Dispatch<React.SetStateAction<string>>;
  token: typeof OPEN_VOUCHER | typeof KRWO;
  isWritable: boolean;
  setIsEnoughBalance?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Token({
  type,
  amount,
  setAmount,
  token,
  isWritable,
  setIsEnoughBalance,
}: TokenProps) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setAmount) return;
    const value = e.target.value;

    if (isNaN(Number(value))) return;

    if (value.length > 18) return;
    setIsEnoughBalance?.(
      !!balance && safeCalc.isGreaterOrEqual(balance, value),
    );
    setAmount(safeCalc.multiply(value, token.unit).toFixed());
  };
  const { balance } = getBalance({
    contractAddress: token.contractAddress,
    decimal: token.decimal,
  });

  const handleMaxButton = () => {
    if (!balance || !setAmount) return;

    const multipliedBalance = safeCalc.multiply(balance, token.unit);
    const asDecimal = safeCalc.divide(multipliedBalance.toFixed(), 10000);

    const truncatedAmount = Math.floor(Number(asDecimal));

    setAmount(safeCalc.multiply(truncatedAmount, 10000).toFixed());
  };

  useEffect(() => {
    if (type === 'pay' && setIsEnoughBalance && balance)
      setIsEnoughBalance(
        safeCalc.isGreaterOrEqual(
          balance,
          safeCalc.divide(amount, token.unit).toFixed(),
        ),
      );
  }, [amount, setIsEnoughBalance]);

  return (
    <section
      className={`rounded-lg bg-black-3 p-4 ${
        isWritable && 'border border-[#137EFC]'
      }`}
    >
      <section className="flex justify-between pb-1 cursor-pointer">
        <p className="c1 font-medium">
          {type === 'pay' ? 'You pay' : 'You receive'}
        </p>
        <div className="py-[6px] px-2 bg-black-1 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex gap-1 items-center">
          <token.icon />
          <p className="c1 font-medium">{token.name}</p>
        </div>
      </section>
      <p className="c0 text-end text-black-8">
        Balance:
        {` ${Number(balance).toLocaleString('ko-kr', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 14,
        })}` || '0.0'}
        {type === 'pay' && (
          <span
            className="c0 font-medium cursor-pointer text-purple-500 ml-1"
            onClick={handleMaxButton}
          >
            MAX
          </span>
        )}
      </p>
      <div className="mb-[2px]">
        {isWritable ? (
          <input
            type="tel"
            inputMode="numeric"
            value={
              amount !== '0'
                ? safeCalc.divide(amount, token.unit).toFixed()
                : ''
            }
            placeholder="0"
            className="font-bold text-h2 w-full placeholder-black-12"
            onChange={handleInput}
          />
        ) : (
          <h2 className="font-bold text-black-6 overflow-hidden">{amount}</h2>
        )}
      </div>
      <p className={`c1 ${!isWritable && 'text-black-6'}`}>
        ₩ {insertComma(amount)}
      </p>
    </section>
  );
}
