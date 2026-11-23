import { useAccount } from "wagmi";
import { randomBytes } from "crypto";
import { signTypedData } from "../_utils/signTyedData";
import { CONTRACT_ADDRESS_MAP } from "@/src/lib/constants/token";
import { checkIsAvailableChain } from "@/src/lib/utils/checkIsAvailableChain";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchReceiveAndSwap } from "@/src/lib/utils/api/swap/fetchReceiveAndSwap";
import { fetchGetTransferReceipt } from "@/src/lib/utils/api/fetchGetReceipt";

interface ReceiveAndSwapProps {
  decimalAppliedAmount: string;
}

export default function useReceiveAndSwap() {
  const { address, chainId } = useAccount();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [shouldPolling, setShouldPolling] = useState<boolean>(false);

  const resetStatus = () => {
    setIsPending(false);
    setIsError(false);
    setIsSuccess(false);
    setTxHash(null);
  };

  const { mutateAsync: mutateReceiveAndSwap } = useMutation({
    mutationFn: fetchReceiveAndSwap,
  });

  const { data: receiveAndSwapReceipt } = useQuery({
    queryKey: ["receiveAndSwapReceipt", txHash],
    queryFn: () =>
      fetchGetTransferReceipt({ chainId: chainId!, txHash: txHash! }),
    enabled: !!chainId && shouldPolling,
    refetchInterval: 1000,
  });

  const receiveAndSwap = async ({
    decimalAppliedAmount,
  }: ReceiveAndSwapProps) => {
    if (!address || !chainId || !checkIsAvailableChain(chainId)) return;
    try {
      setIsPending(true);
      const validAfter = Math.floor(Date.now() / 1000) - 60;
      const validBefore = Math.floor(Date.now() / 1000) + 600;
      const nonce = randomBytes(32).toString("hex");

      const signature = await signTypedData({
        address,
        decimalAppliedAmount,
        validAfter,
        validBefore,
        nonce: `0x${nonce}`,
        to: CONTRACT_ADDRESS_MAP.GIMSWAP_SWAP_AGENT[chainId] as `0x${string}`,
        chainId,
      });

      const { txHash: receiveAndSwapTxHash } = await mutateReceiveAndSwap({
        chainId,
        amountIn: decimalAppliedAmount,
        signature,
        nonce,
        validAfter,
        validBefore,
        recipient: address,
      });

      setTxHash(receiveAndSwapTxHash);
      setShouldPolling(true);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (!receiveAndSwapReceipt) return;
    switch (receiveAndSwapReceipt.status) {
      case "SUCCESS":
        setIsSuccess(true);
        setShouldPolling(false);
        break;
      case "FAILED":
        setIsError(true);
        setShouldPolling(false);
        break;
    }
  }, [receiveAndSwapReceipt?.status]);

  return {
    receiveAndSwap,
    isPending,
    isError,
    isSuccess,
    txHash,
    resetStatus,
  };
}
