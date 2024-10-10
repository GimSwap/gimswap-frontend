import { useEffect, useState } from 'react';
import totalSupplyAbi from '@/src/lib/utils/abis/getTotalSupplyAbi.json';
import { CONTRACT_ADDRESS } from '@/src/lib/constants/contractAddress';
import { createPublicClient, formatUnits } from 'viem';
import { KRWO } from '@/src/lib/constants/token';
import { kaia } from 'wagmi/chains';
import { http } from 'wagmi';

export const useGetTotalSupply = () => {
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const client = createPublicClient({
    chain: kaia,
    transport: http(kaia.rpcUrls.default.http[0]),
    cacheTime: 0,
  });
  useEffect(() => {
    (async () => {
      const totalSupply = (await client.readContract({
        abi: totalSupplyAbi,
        address: CONTRACT_ADDRESS.KRWO as `0x${string}`,
        functionName: 'totalSupply',
      })) as bigint;
      setTotalSupply(formatUnits(totalSupply, KRWO.decimal));
    })();
  }, []);
  return { totalSupply, isPending: !!totalSupply };
};
