import swapAbi from '@/src/lib/utils/abis/swapAbi.json';
import { TokenType } from '../types/TokenType';
import { makeSwapArgument } from '../utils/makeSwapArgument';
import { safeCalc } from '../utils/safeCalc';
import { CONTRACT_ADDRESS } from '../constants/contractAddress';
import { useState } from 'react';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { kaia } from 'wagmi/chains';
import { http, useAccount } from 'wagmi';
import { WALLETS } from '@/src/lib/constants/wallets';

export const useSwap = (token: TokenType, amount: string) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  const { address, connector } = useAccount();

  const to = CONTRACT_ADDRESS.GimSwap;
  const amountToString = safeCalc.divide(amount, token.unit).toFixed();
  const value = safeCalc.multiply(
    amountToString,
    safeCalc.pow(10, token.decimal).toFixed(),
  );
  const callee = CONTRACT_ADDRESS.GimSwap;

  const publicClient = createPublicClient({
    chain: kaia,
    transport: http(),
  });

  const swap = async () => {
    if (!connector || !address) return;
    const currentWalletInfo = WALLETS.find(({ id }) => connector.id === id);

    try {
      const walletClient = createWalletClient({
        chain: kaia,
        transport: custom(await currentWalletInfo?.transport),
      });
      setIsPending(true);

      const args = makeSwapArgument(
        token.method,
        to,
        BigInt(value.toFixed()),
        callee,
      );

      const hash = await walletClient.writeContract({
        address: token.contractAddress as `0x${string}`,
        abi: swapAbi,
        functionName: token.method,
        account: address as `0x${string}`,
        args,
      });

      if (!hash) throw new Error(`transaction error`);
      setHash(hash);

      const { status } = await publicClient.waitForTransactionReceipt({ hash });

      if (status === 'success') setIsSuccess(true);
      else if (status === 'reverted') setIsError(true);
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  return { swap, isSuccess, isPending, error: isError, hash };
};
