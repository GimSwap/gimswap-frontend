import { useSwap } from '@/src/lib/hook/useSwap';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import useReceiveAndSwap from './useReceiveAndSwap';
import { TokenType } from '@/src/lib/types/TokenType';
import { useAccount } from 'wagmi';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { useEffect } from 'react';
import { useHandleWalletConnectDeepLink } from '@/src/lib/hook/useHandleWalletConnectDeepLink';

interface UseSwapHandlerProps {
  isServiceFeeActive?: boolean;
  onSuccess?: (hash: `0x${string}` | null, resetStatus: () => void) => void;
  onError?: (resetStatus: () => void) => void;
  onPending?: () => void;
}

interface ExecuteSwapProps {
  token: TokenType;
  amount: string;
}

export const useSwapHandler = ({
  isServiceFeeActive = false,
  onSuccess,
  onError,
  onPending,
}: UseSwapHandlerProps) => {
  const {
    swap,
    isPending: isSwapPending,
    error: isSwapError,
    isSuccess: isSwapSuccess,
    hash: swapTxHash,
    resetStatus: resetSwapStatus,
  } = useSwap();

  const {
    receiveAndSwap,
    isError: isReceiveAndSwapError,
    isPending: isReceiveAndSwapPending,
    isSuccess: isReceiveAndSwapSuccess,
    txHash: receiveAndSwapTxHash,
    resetStatus: resetReceiveAndSwapStatus,
  } = useReceiveAndSwap();
  const { chainId } = useAccount();
  const { handleWalletConnectDeepLink } = useHandleWalletConnectDeepLink();

  const executeSwap = async ({ token, amount }: ExecuteSwapProps) => {
    if (!chainId || !checkIsAvailableChain(chainId)) return;
    handleWalletConnectDeepLink();
    if (!isServiceFeeActive) {
      swap({
        token,
        amount: safeCalc.multiply(amount, token.unit).toString(),
      });
    } else {
      const decimal = token.multiDecimal
        ? token.decimal[chainId]
        : token.decimal;

      receiveAndSwap({
        decimalAppliedAmount: safeCalc
          .multiply(amount, 10 ** decimal)
          .toString(),
      });
    }
  };

  useEffect(() => {
    if (!isServiceFeeActive) {
      if (isSwapSuccess) {
        onSuccess?.(swapTxHash, resetSwapStatus);
      }
    } else {
      if (isReceiveAndSwapSuccess) {
        onSuccess?.(receiveAndSwapTxHash, resetReceiveAndSwapStatus);
      }
    }
  }, [
    isSwapSuccess,
    isReceiveAndSwapSuccess,
    swapTxHash,
    receiveAndSwapTxHash,
  ]);

  useEffect(() => {
    if (isSwapError || isReceiveAndSwapError) {
      onError?.(resetSwapStatus);
    }
  }, [isSwapError, isReceiveAndSwapError]);

  useEffect(() => {
    if (isSwapPending || isReceiveAndSwapPending) {
      onPending?.();
    }
  }, [isSwapPending, isReceiveAndSwapPending]);

  if (!isServiceFeeActive) {
    return {
      executeSwap,
      isPending: isSwapPending,
      isError: isSwapError,
      isSuccess: isSwapSuccess,
      txHash: swapTxHash,
    };
  } else {
    return {
      executeSwap,
      isSuccess: isReceiveAndSwapSuccess,
      isPending: isReceiveAndSwapPending,
      isError: isReceiveAndSwapError,
      txHash: receiveAndSwapTxHash,
    };
  }
};
