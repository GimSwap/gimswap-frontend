import { useAccount, useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS } from '@/src/lib/constants/contractAddress';
import ERC20Abi from '@/src/lib/utils/abis/ERC20Abi.json';

interface GetAllowanceProps {
  tokenAddress: `0x${string}`;
}

export const useGetAllowance = ({ tokenAddress }: GetAllowanceProps) => {
  const { address } = useAccount();

  const { data: allowance, isLoading } = useReadContract({
    address: tokenAddress,
    abi: ERC20Abi,
    functionName: 'allowance',
    args: [address, CONTRACT_ADDRESS.GimSwap],
  });

  return { allowance, isLoading };
};
