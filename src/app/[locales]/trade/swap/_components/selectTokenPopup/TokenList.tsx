import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import TokenInfo from './TokenInfo';
import { GetBalanceResponseType } from '@/src/lib/types/api/GetBalanceType';
import LoadingSpinner from '@/src/components/LoadingSpinner';
import { applyDecimals } from '@/src/lib/utils/calcTick';

interface TokenListProps {
  tokens: TokenListType[];
  balance: GetBalanceResponseType['balance'] | undefined;
  title: string;
  isLoading: boolean;
  setSelectedToken: (token: TokenListType) => void;
  selectedChainId: number;
}

export default function TokenList({
  tokens,
  balance,
  title,
  isLoading,
  setSelectedToken,
  selectedChainId,
}: TokenListProps) {
  return (
    <section>
      <p className="p1 py-4 pb-1 text-black-8 text-start">{title}</p>
      {!isLoading ? (
        <div className="flex flex-col gap-2">
          {tokens.map((token) => (
            <TokenInfo
              key={token.symbol}
              token={token}
              balance={
                balance
                  ? applyDecimals(balance[token.key], token.decimals, 5)
                  : undefined
              }
              setSelectedToken={setSelectedToken}
              selectedChainId={selectedChainId}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[10dvh]">
          <LoadingSpinner className="border-black-6 rounded-full dark:border-black-6 mt-3 mb-5" />
        </div>
      )}
    </section>
  );
}
