import { wagmiConfig } from '@/src/lib/utils/wagmi';
import { getTransactionReceipt } from '@wagmi/core';
import { useEffect, useState } from 'react';
import { TransactionReceipt } from 'viem';

const POSITION_MANAGER_ADDRESS = '0x68f762d28cebad501c090949e4680697e56848fc';
const EVENT_NAME =
  '0x3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f';

export const useGetTokenId = (txHash: string | undefined) => {
  const [receipt, setReceipt] = useState<TransactionReceipt | undefined>(
    undefined,
  );
  const [tokenId, setTokenId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!txHash) return;
      const receipt = await getTransactionReceipt(wagmiConfig, {
        hash: txHash as `0x${string}`,
      });
      setReceipt(receipt);
    })();
  }, [txHash]);

  useEffect(() => {
    if (!receipt) return;

    receipt.logs.forEach((log) => {
      if (log.address === POSITION_MANAGER_ADDRESS) {
        log.topics.forEach((topic, index) => {
          if (topic === EVENT_NAME && index + 1 < log.topics.length) {
            setTokenId(+log.topics[index + 1]);
          }
        });
      }
    });
  }, [receipt]);

  setIsLoading(false);

  return { tokenId, isLoading };
};
