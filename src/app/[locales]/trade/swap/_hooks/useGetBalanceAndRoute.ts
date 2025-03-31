import { GetBalanceResponseType } from '@/src/lib/types/api/GetBalanceType';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import { fetchGetBalance } from '@/src/lib/utils/api/fetchGetBalance';
import { fetchGetSwapRoute } from '@/src/lib/utils/api/swap/fetchGetSwapRoute';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { useQueries } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

interface UseGetBalanceAndRouteProps {
  debouncedInputFrom: TokenListType | undefined;
  inputFromType: 'pay' | 'receive' | undefined;
  payToken: TokenListType | undefined;
  receiveToken: TokenListType | undefined;
}

export const useGetBalanceAndRoute = ({
  debouncedInputFrom,
  inputFromType,
  payToken,
  receiveToken,
}: UseGetBalanceAndRouteProps) => {
  const { address, chainId } = useAccount();
  const needCheckToken = inputFromType === 'pay' ? payToken : receiveToken;

  const isReadyToQuery =
    !!debouncedInputFrom &&
    !!payToken &&
    !!receiveToken &&
    !!address &&
    !!chainId &&
    !!needCheckToken?.amount &&
    checkIsAvailableChain(chainId) &&
    !!debouncedInputFrom.amount &&
    !isNaN(+debouncedInputFrom.amount) &&
    +debouncedInputFrom.amount > 0;

  const queryResults = useQueries({
    queries: [
      {
        queryKey: ['getBalance', address, chainId],
        queryFn: () =>
          fetchGetBalance({
            walletAddress: address!,
            chainId: chainId!,
          }),
        enabled: !!(address && checkIsAvailableChain(chainId)),
        select: (data: GetBalanceResponseType) => data.balance,
        refetchInterval: 3000,
      },
      {
        queryKey: [
          'swap-route',
          debouncedInputFrom?.symbol,
          debouncedInputFrom?.amount,
          payToken?.symbol,
          receiveToken?.symbol,
        ],
        queryFn: async () =>
          await fetchGetSwapRoute({
            chainId: chainId!,
            executor: address!,
            from: payToken!.contractAddress,
            to: receiveToken!.contractAddress,
            amount: safeCalc
              .multiply(
                debouncedInputFrom!.amount!,
                10 ** debouncedInputFrom!.decimals,
              )
              .toString(),
            exactInput: inputFromType === 'pay',
          }),
        enabled: isReadyToQuery,
        refetchInterval: (query: { state: { fetchFailureCount: number } }) => {
          if (query.state.fetchFailureCount > 3) return false;
          return 3000;
        },
        retryDelay: 500,
      },
    ] as const,
  });

  // There is an issue with destructuring, so we extract it like this
  const balanceQuery = queryResults[0];
  const routeQuery = queryResults[1];

  const balance = balanceQuery.data;
  const routes = routeQuery.data;
  const isError = routeQuery.isError;
  const isPending = routeQuery.isLoading;

  return { balance, routes, isError, isPending };
};
