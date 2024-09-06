import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, ethers } from "ethers";
import { useEffect, useState } from "react";
import { CONTRACT_ADDRESS } from "../constants/contractAddress";
import getFeeAbi from "@/src/lib/utils/abis/getFeeAbi.json";

export const useGetFee = (contractAddress: string, amount: number) => {
  const { walletProvider } = useWeb3ModalProvider();
  const [fee, setFee] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      if (!walletProvider) return;

      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS.GimSwap,
        getFeeAbi,
        signer,
      );

      const feeNumerator = await contract.feeNumerator();
      setFee(Number(feeNumerator));
    })();
  }, [walletProvider, contractAddress, amount]);

  return { fee };
};
