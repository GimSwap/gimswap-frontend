"use client";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider } from "ethers";

interface useAddTokenProps {
  address: string;
  symbol: string;
  image: any;
}

// useAddTokenProps를 기본으로 사용할 수도 있습니다.
export const useAddToken = () => {
  const { walletProvider } = useWeb3ModalProvider();

  const addToken = async ({ address, symbol, image }: useAddTokenProps) => {
    if (!walletProvider) return;

    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      await signer.provider.send("wallet_watchAsset", {
        type: "ERC20",
        options: {
          address,
          symbol,
          image,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return { addToken };
};
