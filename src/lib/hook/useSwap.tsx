import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, ContractTransactionReceipt, ethers } from "ethers";
import { useCallback, useState } from "react";
import { CONTRACT_ADDRESS } from "../constants/contractAddress";
import swapAbi from "@/src/lib/utils/abis/swapAbi.json";
import { TokenType } from "../types/TokenType";
import { makeSwapArgument } from "../utils/makeSwapArgument";
import { safeCalc } from "../utils/safeCalc";

export const useSwap = (token: TokenType, amount: string) => {
  const { walletProvider } = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<ContractTransactionReceipt | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const swap = useCallback(async () => {
    if (!walletProvider) {
      setError("No wallet provider available");
      return;
    }

    setIsLoading(true);

    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      const swapContract = new ethers.Contract(
        token.contractAddress,
        swapAbi,
        signer,
      );

      const to = CONTRACT_ADDRESS.GimSwap;

      const amountToString = safeCalc.divide(amount, token.unit).toFixed();

      const value = safeCalc.multiply(
        amountToString,
        safeCalc.pow(10, token.decimal).toFixed(),
      );

      const callee = CONTRACT_ADDRESS.GimSwap;

      const tx = await swapContract[token.method](
        ...makeSwapArgument(token.method, to, BigInt(value.toFixed()), callee),
      );

      const receipt = (await tx.wait()) as ContractTransactionReceipt;

      setReceipt(receipt);
      setIsSuccess(true);
    } catch (error) {
      console.error("Swap transaction failed:", error);
      setError("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  }, [walletProvider, amount, address, token]);

  return { swap, isLoading, isSuccess, error, receipt };
};
