import swapAbi from '@/src/lib/utils/abis/swapAbi.json';
import { TokenType } from '../types/TokenType';
import { makeSwapArgument } from '../utils/makeSwapArgument';
import { safeCalc } from '../utils/safeCalc';
import { useState } from 'react';
import { createWalletClient, custom } from 'viem';
import { useAccount } from 'wagmi';
import { WALLETS } from '@/src/lib/constants/wallets';
import { fetchSendLog } from '../utils/api/fetchSendLog';
import { waitForTransactionReceipt } from '@wagmi/core';
import { wagmiConfig } from '../utils/wagmi';
import { ChainIdType } from '../types/ChainIdType';
import { checkIsAvailableChain } from '../utils/checkIsAvailableChain';
import { CONTRACT_ADDRESS_MAP, defaultChain } from '../constants/token';

export const useSwap = (token: TokenType, amount: string) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  const { address, connector, chainId, chain } = useAccount();

  const amountToString = safeCalc.divide(amount, token.unit).toFixed();
  const decimal = token.multiDecimal
    ? token?.decimal[checkIsAvailableChain(chainId) ? chainId : defaultChain.id]
    : token.decimal;

  const value = safeCalc.multiply(
    amountToString,
    safeCalc.pow(10, decimal).toFixed(),
  );

  const swap = async () => {
    if (!connector || !address || !chainId || !checkIsAvailableChain(chainId))
      return;
    const to = CONTRACT_ADDRESS_MAP.GIMSWAP[chainId];
    const callee = CONTRACT_ADDRESS_MAP.GIMSWAP[chainId];

    const currentWalletInfo = WALLETS.find(({ id }) =>
      connector.id.replace(/\s+/g, '').toLowerCase().includes(id.toLowerCase()),
    );

    try {
      const walletClient = createWalletClient({
        chain: checkIsAvailableChain(chainId) ? chain : defaultChain,
        transport: custom(currentWalletInfo?.transport),
      });

      setIsPending(true);
      const args = makeSwapArgument(
        token.method,
        to,
        BigInt(value.toFixed()),
        callee,
      );

      const hash = await walletClient.writeContract({
        address: token.contractAddress[chainId as ChainIdType] as `0x${string}`,
        abi: swapAbi,
        functionName: token.method,
        account: address as `0x${string}`,
        args,
      });
      if (!hash) throw new Error(`transaction error`);
      setHash(hash);
      const { status } = await waitForTransactionReceipt(wagmiConfig, { hash });
      if (status === 'success') setIsSuccess(true);
      else if (status === 'reverted') setIsError(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      fetchSendLog({
        name: 'swap',
        error: errorMessage,
        currentWalletInfoId: currentWalletInfo?.id,
        connectorId: connector.id,
      });
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  return { swap, isSuccess, isPending, error: isError, hash };
};
