import { inCludes } from './typeSafe/inCludes';
import { chains } from './wagmi';

const chainIds = chains.map(
  (chain) => chain.id,
) as (typeof chains)[number]['id'][];

export const checkIsAvailableChain = (
  chainId: number | undefined,
): chainId is (typeof chains)[number]['id'] => {
  if (!chainId) return false;
  return inCludes(chainIds, chainId);
};
