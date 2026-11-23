import { wagmiConfig } from './wagmi';
import { getTransactionReceipt } from '@wagmi/core';

const POSITION_MANAGER_ADDRESS = '0x68f762d28cebad501c090949e4680697e56848fc';
const EVENT_NAME =
  '0x3067048beee31b25b2f1681f88dac838c8bba36af25bfb2b7cf7473a5847e35f';

export const getTokenId = async (txHash: string) => {
  const receipt = await getTransactionReceipt(wagmiConfig, {
    hash: txHash as `0x${string}`,
  });
  let tokenId: number | undefined;

  receipt.logs.forEach((log) => {
    if (log.address === POSITION_MANAGER_ADDRESS) {
      log.topics.forEach((topic, index) => {
        if (topic === EVENT_NAME && index + 1 < log.topics.length) {
          tokenId = +log.topics[index + 1];
          return;
        }
      });
    }
  });
  return tokenId;
};
