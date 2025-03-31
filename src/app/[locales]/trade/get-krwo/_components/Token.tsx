import { useEffect } from 'react';
import { insertComma } from '@/src/lib/utils/insertComma';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { fetchGetBalance } from '@/src/lib/utils/api/fetchGetBalance';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { TokenType } from '@/src/lib/types/TokenType';
import { defaultChain, KRWO } from '@/src/lib/constants/token';
import BalanceIcon from '@/public/svg/balance.svg';
import Copy from '@/public/svg/copy.svg';
import { copyToClipboard } from '@/src/lib/utils/copyToClipboard';
import {
  getBalanceWithDecimal,
  handleMax,
  isWritable,
  handleTokenInput,
} from '@/src/app/[locales]/trade/get-krwo/_utils';
import { applyDecimals } from '@/src/lib/utils/calcTick';

interface TokenProps {
  type: 'pay' | 'receive';
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  token: TokenType;
  setIsEnoughBalance?: React.Dispatch<React.SetStateAction<boolean>>;
  serviceFee?: number | undefined;
  isServiceFeeActive?: boolean;
}

export default function Token({
  type,
  amount,
  setAmount,
  token,
  setIsEnoughBalance,
  serviceFee,
  isServiceFeeActive,
}: TokenProps) {
  const { address, chainId } = useAccount();

  const { data } = useQuery({
    queryKey: ['getBalance', address, chainId],
    queryFn: () =>
      fetchGetBalance({
        walletAddress: address!,
        chainId: chainId as ChainIdType,
      }),
    enabled: !!(address && chainId),
    select: (data) => data.balance,
  });

  const symbol = token.symbol.toLowerCase() as 'ov' | 'krwo';

  const decimal = token.multiDecimal
    ? token?.decimal[checkIsAvailableChain(chainId) ? chainId : defaultChain.id]
    : token?.decimal;

  const balance = getBalanceWithDecimal({
    balance: data?.[symbol],
    decimal,
  });

  const Icon =
    typeof token.icon === 'object'
      ? token.icon[checkIsAvailableChain(chainId) ? chainId : defaultChain.id]
      : token.icon;

  const getInputValue = () => {
    if (amount === '0') return '0';

    const amountWithDecimal = safeCalc.divide(amount, token.unit).toString();

    return amountWithDecimal;
  };

  const getReceiveAmount = () => {
    if (amount === '0') return '0';
    if (
      isServiceFeeActive &&
      type === 'receive' &&
      token.symbol === 'KRWO' &&
      serviceFee
    ) {
      return safeCalc
        .subtract(amount, applyDecimals(serviceFee, KRWO.decimal))
        .toString();
    }
    return amount;
  };
  // TODO: Balance fetching will be done in the parent component and the isEnoughBalance state will be removed.
  useEffect(() => {
    if (type === 'pay' && setIsEnoughBalance && balance)
      setIsEnoughBalance(
        safeCalc.isGreaterOrEqual(
          balance,
          safeCalc.divide(amount, token.unit).toFixed(),
        ),
      );
  }, [type, amount, setIsEnoughBalance, balance, token.unit]);

  return (
    <section>
      <section className="flex justify-between pb-1 cursor-pointer">
        <p className="c1 font-medium">
          {type === 'pay' ? 'You pay' : 'You receive'}
        </p>
        <div className="flex flex-row gap-1 items-center">
          <div className="py-[6px] px-2 bg-black-1 rounded-full shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] flex gap-1 items-center">
            <Icon className="w-5 h-5" />
            <p className="c1 font-medium whitespace-nowrap">{token.symbol}</p>
          </div>
          <Copy
            className="stroke-black-8 w-4 h-4"
            onClick={async () =>
              await copyToClipboard(
                token.contractAddress[
                  checkIsAvailableChain(chainId) ? chainId : defaultChain.id
                ],
              )
            }
          />
        </div>
      </section>
      <div className="mb-[2px]">
        {isWritable(token) ? (
          <input
            type="tel"
            inputMode="numeric"
            value={getInputValue()}
            placeholder="0"
            className="font-pretendard font-bold text-h2 w-full placeholder-black-12"
            onChange={(e) =>
              handleTokenInput({
                value: e.target.value,
                setAmount,
                token,
                balance,
                setIsEnoughBalance,
              })
            }
          />
        ) : (
          <h2 className="font-bold text-black-6 overflow-hidden">
            {getReceiveAmount()}
          </h2>
        )}
      </div>
      <div className="flex flex-row justify-between">
        <p className={`c1 ${!isWritable(token) && 'text-black-6'}`}>
          ₩ {insertComma(getReceiveAmount())}
        </p>
        <div className="flex flex-row items-center">
          <BalanceIcon className="w-4 h-4 mr-[2px]" />
          <p className="c0 text-black-8">
            {` ${Number(balance).toLocaleString('ko-kr', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 5,
            })}` || '0.0'}
          </p>
          {type === 'pay' && (
            <span
              className="c0 font-medium cursor-pointer text-purple-500 ml-1"
              onClick={() => handleMax({ balance, setAmount, token })}
            >
              MAX
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
