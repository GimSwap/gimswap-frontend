import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import TokenName from './TokenName';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { insertComma } from '@/src/lib/utils/insertComma';
import { GetBalanceResponseType } from '@/src/lib/types/api/GetBalanceType';
import BalanceIcon from '@/public/svg/balance.svg';
import { useHandleTokenAmount } from '../../_hooks/swapTokenBox/useHandleTokenAmount';
import { getBalance } from '../../_utils/swapTokenBox';
import SelectTokenPopup from '../selectTokenPopup/SelectTokenPopup';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { NETWORK_COST } from '@/src/lib/constants/NetworkCost';
import { useAccount } from 'wagmi';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';

const NETWORK_COST_MULTIPLIER = 4;

interface SwapTokenBoxProps {
  type: 'pay' | 'receive';
  tokens: {
    pay: TokenListType | undefined;
    receive: TokenListType | undefined;
  };
  setSelectedToken: React.Dispatch<
    React.SetStateAction<TokenListType | undefined>
  >;
  setOppositeToken: React.Dispatch<
    React.SetStateAction<TokenListType | undefined>
  >;
  exactInput: boolean;
  balance: GetBalanceResponseType['balance'] | undefined;
  setInputFromType: React.Dispatch<'pay' | 'receive' | undefined>;
}

export default function SwapTokenBox({
  type,
  tokens,
  setSelectedToken,
  setOppositeToken,
  balance,
  setInputFromType,
}: SwapTokenBoxProps) {
  const { openPopup } = usePopupStore((state) => state);
  const { chainId } = useAccount();
  const { handleChangeTokenAmount, handleMax } = useHandleTokenAmount({
    type,
  });

  const isDisabled = !tokens[type]?.symbol;

  const title = type === 'pay' ? 'You pay' : 'You receive';

  const decimalAppliedBalance = getBalance({ balance, tokens, type });

  const networkCost = checkIsAvailableChain(chainId)
    ? NETWORK_COST[chainId] * NETWORK_COST_MULTIPLIER
    : 0;

  const networkCostSubtractedAmount = safeCalc
    .subtract(decimalAppliedBalance, networkCost)
    .toString();

  const isMaxDisabled =
    tokens[type]?.key === 'native'
      ? +networkCostSubtractedAmount < 0
      : +decimalAppliedBalance <= 0;

  return (
    <section className="p-4 rounded-lg bg-black-3 flex flex-col gap-2 w-full">
      <div
        className="flex flex-col gap-2"
        onClick={() => {
          if (!isDisabled) return;
          openPopup(SelectTokenPopup, {
            setSelectedToken,
            setOppositeToken,
          });
        }}
      >
        <div className="flex flex-row justify-between">
          <p className="p1 text-black-8">{title}</p>
          <TokenName
            token={tokens[type]}
            setSelectedToken={setSelectedToken}
            setOppositeToken={setOppositeToken}
          />
        </div>
        <input
          type="text"
          value={tokens[type]?.amount ?? ''}
          placeholder="0"
          onClick={() => {
            if (!isDisabled) return;
            openPopup(SelectTokenPopup, {
              setSelectedToken,
              setOppositeToken,
            });
          }}
          onChange={(e) => {
            handleChangeTokenAmount({
              amount: e.target.value,
              setSelectedToken,
              tokens,
            });
            setInputFromType(type);
          }}
          readOnly={isDisabled}
          className={`text-h2 font-bold ${
            isDisabled
              ? 'placeholder:text-black-6'
              : 'placeholder:text-black-12'
          }`}
        />
        <div className="flex flex-row items-center justify-between">
          <p className={`c1 ${isDisabled ? 'text-black-6' : 'text-black-8'}`}>
            {`₩ ${
              tokens[type]?.krwValue
                ? insertComma(formatNumber(tokens[type]!.krwValue, 0))
                : '0'
            }`}
          </p>
          <div className="flex flex-row items-center">
            <BalanceIcon className="w-4 h-4 mr-[2px]" />
            <p className="c0 text-black-8">
              {insertComma(
                formatNumber(getBalance({ balance, tokens, type }), 5),
              )}
            </p>
            {type === 'pay' && (
              <span
                className={`c0 font-medium cursor-pointer ${
                  isMaxDisabled ? 'text-black-6' : 'text-purple-500'
                } ml-1`}
                onClick={() => {
                  if (isMaxDisabled) return;
                  handleMax({
                    maxAmount: getBalance({ balance, tokens, type }),
                    networkCost,
                    setSelectedToken,
                    tokens,
                  });
                  setInputFromType(type);
                }}
              >
                Max
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
