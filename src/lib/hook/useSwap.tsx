import swapAbi from '@/src/lib/utils/abis/swapAbi.json';
import { TokenType } from '../types/TokenType';
import { makeSwapArgument } from '../utils/makeSwapArgument';
import { safeCalc } from '../utils/safeCalc';
import { useEffect, useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { fetchSendLog } from '../utils/api/fetchSendLog';
import { ChainIdType } from '../types/ChainIdType';
import { checkIsAvailableChain } from '../utils/checkIsAvailableChain';
import { CONTRACT_ADDRESS_MAP, defaultChain } from '../constants/token';
import { useQuery } from '@tanstack/react-query';
import { fetchGetTransferReceipt } from '../utils/api/fetchGetReceipt';

interface SwapProps {
  token: TokenType;
  amount: string;
}

export const useSwap = () => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [hash, setHash] = useState<`0x${string}` | null>(null);
  const [shouldPolling, setShouldPolling] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const { address, connector, chainId } = useAccount();

  const resetStatus = () => {
    setIsPending(false);
    setIsError(false);
    setIsSuccess(false);
    setHash(null);
  };

  const { data: receiptStatus } = useQuery({
    queryKey: ['getTransferReceipt', hash, chainId],
    queryFn: () =>
      fetchGetTransferReceipt({ txHash: hash!, chainId: chainId! }),
    enabled: !!shouldPolling && !!chainId && !!address,
    refetchInterval: 1000,
    select: (data) => data.status,
  });

  const swap = async ({ token, amount }: SwapProps) => {
    if (!connector || !address || !chainId || !checkIsAvailableChain(chainId))
      return;

    const amountToString = safeCalc.divide(amount, token.unit).toFixed();
    const decimal = token.multiDecimal
      ? token?.decimal[
          checkIsAvailableChain(chainId) ? chainId : defaultChain.id
        ]
      : token.decimal;

    const value = safeCalc.multiply(
      amountToString,
      safeCalc.pow(10, decimal).toFixed(),
    );
    const to = CONTRACT_ADDRESS_MAP.GIMSWAP[chainId];
    const callee = CONTRACT_ADDRESS_MAP.GIMSWAP[chainId];

    try {
      setIsPending(true);
      const args = makeSwapArgument(
        token.method,
        to,
        BigInt(value.toFixed()),
        callee,
      );

      const hash = await writeContractAsync({
        address: token.contractAddress[chainId as ChainIdType] as `0x${string}`,
        abi: swapAbi,
        functionName: token.method,
        account: address as `0x${string}`,
        args,
      });
      if (!hash) throw new Error(`transaction error`);
      setHash(hash);
      setShouldPolling(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      fetchSendLog({
        name: 'swap',
        error: errorMessage,
        connectorId: connector.id,
      });
      setIsError(true);
    }
  };

  useEffect(() => {
    if (receiptStatus === 'SUCCESS') {
      setIsSuccess(true);
      setIsPending(false);
      setShouldPolling(false);
    } else if (receiptStatus === 'FAILED') {
      setIsError(true);
      setIsPending(false);
      setShouldPolling(false);
    }
  }, [receiptStatus]);

  return {
    swap,
    isSuccess,
    setIsSuccess,
    isPending,
    error: isError,
    hash,
    resetStatus,
  };
};
