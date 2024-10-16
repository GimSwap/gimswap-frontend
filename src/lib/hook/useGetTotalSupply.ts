import { useEffect, useState } from 'react';
import totalSupplyAbi from '@/src/lib/utils/abis/getTotalSupplyAbi.json';
import { CONTRACT_ADDRESS } from '@/src/lib/constants/contractAddress';
import { createPublicClient, fallback, formatUnits, http } from 'viem';
import { KRWO } from '@/src/lib/constants/token';
import { kaia } from 'wagmi/chains';

export const useGetTotalSupply = () => {
  const [totalSupply, setTotalSupply] = useState<string | null>(null);
  const client = createPublicClient({
    chain: kaia,
    transport: fallback([
      http('https://public-en.node.kaia.io'),
      http('https://kaia-mainnet.rpc.grove.city/v1/803ceedf'),
      http('https://klaytn.drpc.org'),
      http('https://go.getblock.io/d7094dbd80ab474ba7042603fe912332'),
      http('https://1rpc.io/klay'),
    ]),

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
