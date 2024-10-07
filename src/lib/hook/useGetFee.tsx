import { CONTRACT_ADDRESS } from '../constants/contractAddress';
import getFeeAbi from '@/src/lib/utils/abis/getFeeAbi.json';
import { useReadContract } from 'wagmi';
import { type Abi } from 'viem';
//@ts-ignore
import { ResolvedRegister } from '@wagmi/core/src/types/register';

export const useGetFee = (amount: string) => {
  const { data: fee, isPending } = useReadContract<
    Abi,
    'feeNumberator',
    [],
    ResolvedRegister['config'],
    { data: bigint }
  >({
    abi: getFeeAbi as Abi,
    address: CONTRACT_ADDRESS.GimSwap as `0x${string}`,
    functionName: 'feeNumerator',
  });

  if (amount === '0' || isPending) return { fee: null };

  return { fee: Number(fee) };
};
