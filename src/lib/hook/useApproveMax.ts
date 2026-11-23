import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import ERC20Abi from '@/src/lib/utils/abis/ERC20Abi.json';
import { MAX_ALLOWANCE } from '../constants/token';
import { wagmiConfig } from '../utils/wagmi';
import { useState } from 'react';
import { ChainIdType } from '../types/ChainIdType';
import { useGetCurrentWallet } from './useGetCurrentWallet';
import { useHandleWalletConnectDeepLink } from './useHandleWalletConnectDeepLink';

export const useApproveMax = () => {
  const [isPending, setIsPending] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { data: currentWallet } = useGetCurrentWallet();
  const { handleWalletConnectDeepLink } = useHandleWalletConnectDeepLink();

  const approveMax = async (
    chainId: ChainIdType,
    tokenAddress: string,
    spenderAddress: `0x${string}`,
  ) => {
    try {
      if (!currentWallet) throw new Error('No wallet found');
      setIsPending(true);

      handleWalletConnectDeepLink();

      const tx = await writeContractAsync({
        abi: ERC20Abi,
        functionName: 'approve',
        args: [spenderAddress, MAX_ALLOWANCE],
        address: tokenAddress as `0x${string}`,
        chainId,
      });
      const receipt = await waitForTransactionReceipt(wagmiConfig, {
        chainId,
        hash: tx,
      });
      setIsPending(false);
      return receipt;
    } catch (error) {
      setIsPending(false);
      return {
        status: 'error',
      };
    }
  };

  return { approveMax, isPending };
};
