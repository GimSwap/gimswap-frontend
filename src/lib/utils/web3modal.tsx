"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { KLAYTN } from "../constants/token";

const { blockExplorerUrl, chainId, chainName, currency, klaytnRpcUrl } = KLAYTN;
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const mainnet = {
  chainId,
  name: chainName!,
  currency,
  explorerUrl: blockExplorerUrl,
  rpcUrl: klaytnRpcUrl,
};

const metadata = {
  name: "Gim Swap",
  description: "Gim Swap",
  url: "https://www.gimswap.com/",
  icons: ["/favicon.ico"],
};
const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: chainId,
  enableCoinbase: false,
});

createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId: projectId!,
  allowUnsupportedChain: true,
  includeWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamask id
  ],
});

export function AppKit({ children }: { children: React.ReactNode }) {
  return children;
}
