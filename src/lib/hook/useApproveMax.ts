import { useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import ERC20Abi from '@/src/lib/utils/abis/ERC20Abi.json';
import { MAX_ALLOWANCE } from '../constants/token';
import { wagmiConfig } from '../utils/wagmi';
import { useState } from 'react';
import { ChainIdType } from '../types/ChainIdType';
import { useGetCurrentWallet } from './useGetCurrentWallet';
import { checkIsMobileDevice } from '../utils/checkIsMobileDevice';

export const useApproveMax = () => {
  const [isPending, setIsPending] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { data: currentWallet } = useGetCurrentWallet();

  const approveMax = async (
    chainId: ChainIdType,
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
  ) => {
    try {
      if (!currentWallet) throw new Error('No wallet found');
      setIsPending(true);

      if (!currentWallet.supportInAppBrowser && checkIsMobileDevice())
        window.open(currentWallet.deepLink);

      const tx = await writeContractAsync({
        abi: ERC20Abi,
        functionName: 'approve',
        args: [spenderAddress, MAX_ALLOWANCE],
        address: tokenAddress,
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
