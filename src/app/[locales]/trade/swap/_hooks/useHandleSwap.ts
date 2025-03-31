import { useSendTransaction } from '@/src/lib/hook/useSendTransaction';
import { GetSwapRouteResponseType } from '@/src/lib/types/api/swap/GetSwapRouteType';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import { fetchGetTransferReceipt } from '@/src/lib/utils/api/fetchGetReceipt';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface UseHandleSwapProps {
  onSuccess?: (hash: string) => void;
  onError?: () => void;
  onPending?: () => void;
  chainId: number;
}

interface HandleSwapProps {
  payToken: TokenListType | undefined;
  receiveToken: TokenListType | undefined;
  routes: GetSwapRouteResponseType | undefined;
}

export const useHandleSwap = ({
  onSuccess,
  onError,
  onPending,
  chainId,
}: UseHandleSwapProps) => {
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    data: hash,
    sendTransactionAsync,
    isPending,
    isError: isSendTransactionError,
  } = useSendTransaction();

  const [shouldPolling, setShouldPolling] = useState(false);

  const { data: receiptStatus } = useQuery({
    queryKey: ['getTransferReceipt', hash, chainId],
    queryFn: () => fetchGetTransferReceipt({ txHash: hash!, chainId }),
    enabled: !!shouldPolling,
    select: (data) => data.status,
    refetchInterval: 1000,
  });

  const handleSwap = async ({
    payToken,
    receiveToken,
    routes,
  }: HandleSwapProps) => {
    if (!payToken || !payToken.amount || !receiveToken || !routes) return;

    await sendTransactionAsync({
      to: routes.contractAddress,
      data: routes.data,
      value:
        payToken.key === 'native'
          ? BigInt(
              safeCalc
                .multiply(payToken.amount, 10 ** payToken.decimals)
                .toString(),
            )
          : undefined,
    });
    setShouldPolling(true);
  };

  useEffect(() => {
    if (shouldPolling) {
      if (receiptStatus === 'SUCCESS') {
        onSuccess?.(hash!);
        setIsSuccess(true);
        setShouldPolling(false);
      } else if (receiptStatus === 'FAILED') {
        onError?.();
        setIsError(true);
        setShouldPolling(false);
      }
    }
  }, [shouldPolling, receiptStatus]);

  useEffect(() => {
    if (isSendTransactionError) {
      onError?.();
      setIsError(true);
      setShouldPolling(false);
    }
  }, [isSendTransactionError]);

  useEffect(() => {
    if (isPending) {
      onPending?.();
    }
  }, [isPending]);

  return { handleSwap, isError, isSuccess, isPending, hash };
};
