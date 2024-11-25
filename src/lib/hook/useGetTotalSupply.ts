import { useEffect, useState } from 'react';
import totalSupplyAbi from '@/src/lib/utils/abis/getTotalSupplyAbi.json';
import { CONTRACT_ADDRESS } from '@/src/lib/constants/contractAddress';
import { createPublicClient, fallback, formatUnits, http } from 'viem';
import { KRWO } from '@/src/lib/constants/token';
import { kaia, kairos } from 'wagmi/chains';

export const useGetTotalSupply = () => {
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const network = process.env.VERCEL_ENV !== 'production' ? kairos : kaia;
  const client = createPublicClient({
    chain: network,
    transport: fallback([http(network.rpcUrls.default.http[0])]),
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
