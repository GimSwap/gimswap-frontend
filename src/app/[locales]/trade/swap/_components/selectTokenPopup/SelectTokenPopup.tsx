import PopupTemplate from '@/src/components/PopupTemplate';
import { fetchGetTokenList } from '@/src/lib/utils/api/swap/fetchGetToken';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import SearchIcon from '@/public/svg/search.svg';
import {
  GetTokenListResponseType,
  TokenListType,
} from '@/src/lib/types/api/swap/GetTokenList';
import { chains } from '@/src/lib/utils/wagmi';
import { CHAIN_ICONS, CHAIN_NAME_MAP } from '@/src/lib/constants/token';
import { fetchGetBalance } from '@/src/lib/utils/api/fetchGetBalance';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { GetBalanceResponseType } from '@/src/lib/types/api/GetBalanceType';
import TokenList from './TokenList';
import { getRecentUsedToken } from '../../_utils/handleRecentToken';
import { useDebounce } from '@/src/lib/hook/useDebounce';

interface SelectTokenPopupProps {
  open: boolean;
  onClose: () => void;
  setSelectedToken: React.Dispatch<
    React.SetStateAction<TokenListType | undefined>
  >;
  setOppositeToken: React.Dispatch<
    React.SetStateAction<TokenListType | undefined>
  >;
}

export default function SelectTokenPopup({
  open,
  onClose,
  setSelectedToken,
  setOppositeToken,
}: SelectTokenPopupProps) {
  const { chainId, address, isConnected } = useAccount();
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { debouncedValue: debouncedSearchQuery } = useDebounce(
    searchQuery,
    500,
  );

  const [
    { data: tokens, isLoading: isTokensLoading },
    { data: balance },
    { data: recentUsedTokens, isLoading: isRecentUsedTokensLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ['tokens', selectedChainId],
        queryFn: () => fetchGetTokenList({ chainId: selectedChainId! }),
        enabled: !!selectedChainId,
        select: (data: GetTokenListResponseType) => data.tokens,
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: ['getBalance', address, selectedChainId],
        queryFn: () =>
          fetchGetBalance({
            walletAddress: address!,
            chainId: selectedChainId!,
          }),
        enabled: !!(
          address &&
          selectedChainId &&
          checkIsAvailableChain(selectedChainId)
        ),
        select: (data: GetBalanceResponseType) => data.balance,
      },
      {
        queryKey: ['recentUsedTokens', address, selectedChainId],
        queryFn: () => getRecentUsedToken(selectedChainId!),
      },
    ],
  });

  const handleSetSelectedToken = (token: TokenListType) => {
    setSelectedToken(token);
    setOppositeToken((prev) => ({
      ...prev!,
      amount: undefined,
    }));
  };

  useEffect(() => {
    setSelectedChainId(chainId ?? chains[0].id);
  }, [chainId]);

  const filteredTokens = (tokens ?? []).filter(
    (token) =>
      token.symbol.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      token.contractAddress
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()),
  );

  return (
    <PopupTemplate
      open={open}
      onClose={onClose}
      showCloseButton
      useTemplate={false}
      closeButtonStyle="top-9"
    >
      <section className="mx-6 flex flex-col pb-5 max-h-[80vh] overflow-y-auto">
        <h3 className="font-bold">Select Token</h3>
        <div className="mt-6 rounded-full px-4 py-3 bg-black-3 w-full flex flex-row items-center gap-2">
          <SearchIcon className="w-6 h-[24px] stroke-black-7" />
          <input
            type="text"
            placeholder="Search name or paste address"
            className="text-h5 placeholder:text-black-6 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {!isConnected && (
          <section className="flex flex-row gap-2 pt-6">
            {chains.map(({ id }) => {
              const Icon = CHAIN_ICONS[id];
              return (
                <div
                  key={id}
                  className={`cursor-pointer flex flex-row gap-1 items-center px-2 py-[6px] rounded-full bg-black-2 border border-${
                    selectedChainId === id ? 'purple-500' : 'black-4'
                  }`}
                  onClick={() => setSelectedChainId(id)}
                >
                  {Icon && <Icon className="w-5 h-[20px]" />}
                  <p className="c1 font-medium">{CHAIN_NAME_MAP[id]}</p>
                </div>
              );
            })}
          </section>
        )}
        {recentUsedTokens &&
          recentUsedTokens.length > 0 &&
          !isRecentUsedTokensLoading &&
          tokens?.length == filteredTokens.length && (
            <TokenList
              tokens={recentUsedTokens}
              balance={balance}
              title="Recent"
              isLoading={isRecentUsedTokensLoading}
              setSelectedToken={handleSetSelectedToken}
              selectedChainId={selectedChainId ?? chains[0].id}
            />
          )}
        {filteredTokens.length == 0 ? (
          <p className="p1 py-6 pb-1 text-black-8 text-center">
            No results found.
          </p>
        ) : (
          <TokenList
            tokens={filteredTokens}
            balance={balance}
            title="Tokens List"
            isLoading={isTokensLoading}
            setSelectedToken={handleSetSelectedToken}
            selectedChainId={selectedChainId ?? chains[0].id}
          />
        )}
      </section>
    </PopupTemplate>
  );
}
