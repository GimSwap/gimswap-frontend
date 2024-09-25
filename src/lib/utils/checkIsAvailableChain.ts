const availableChain = [Number(process.env.NEXT_PUBLIC_KLAYTN_CHAIN_ID)];

export const checkIsAvailableChain = (chainId: number | undefined) => {
  if (!chainId) return false;
  return availableChain.includes(chainId);
};
