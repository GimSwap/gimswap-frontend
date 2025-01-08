import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import ERC20Abi from '@/src/lib/utils/abis/ERC20Abi.json';
import { MAX_ALLOWANCE } from '../constants/token';
import { wagmiConfig } from '../utils/wagmi';
import { useState } from 'react';

export const useApproveMax = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const approveMax = async (
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
  ) => {
    setIsPending(true);
    const tx = await writeContractAsync({
      abi: ERC20Abi,
      functionName: 'approve',
      args: [spenderAddress, MAX_ALLOWANCE],
      address: tokenAddress,
      chainId: 8217,
    });
    const receipt = await waitForTransactionReceipt(wagmiConfig, {
      chainId: 8217,
      hash: tx,
    });
    if (receipt.status === 'success') setIsSuccess(true);
    setIsPending(false);
  };

  return { approveMax, isPending, isSuccess };
};
