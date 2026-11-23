import getFeeAbi from '@/src/lib/utils/abis/getFeeAbi.json';
import { useAccount, useReadContract } from 'wagmi';
import { type Abi } from 'viem';
//@ts-ignore
import { ResolvedRegister } from '@wagmi/core/src/types/register';
import { CONTRACT_ADDRESS_MAP } from '../constants/token';
import { ChainIdType } from '../types/ChainIdType';

export const useGetFee = (amount: string) => {
  const { chainId } = useAccount();

  const { data: fee, isPending } = useReadContract<
    Abi,
    'feeNumerator',
    [],
    ResolvedRegister['config'],
    { data: bigint }
  >({
    abi: getFeeAbi as Abi,
    address: CONTRACT_ADDRESS_MAP.GIMSWAP[
      chainId as ChainIdType
    ] as `0x${string}`,
    functionName: 'feeNumerator',
  });

  if (!fee || amount === '0' || isPending) return { fee: 0 };

  return { fee: Number(fee) };
};
