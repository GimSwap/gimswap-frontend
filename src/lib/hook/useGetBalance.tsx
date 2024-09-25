import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers/react';
import { BrowserProvider, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import getBalanceAbi from '@/src/lib/utils/abis/getERC20Balance.json';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';

interface GetBalanceProps {
  contractAddress: string;
  decimal: number;
}

export const getBalance = ({ contractAddress, decimal }: GetBalanceProps) => {
  const [balance, setBalance] = useState<string | null>(null);
  const { walletProvider } = useWeb3ModalProvider();
  const { address: walletAddress } = useWeb3ModalAccount();
  const { chainId } = useWeb3ModalAccount();

  useEffect(() => {
    (async () => {
      if (
        !walletProvider ||
        !contractAddress ||
        !checkIsAvailableChain(chainId)
      )
        return;

      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        getBalanceAbi,
        signer,
      );
      const balance = await contract.balanceOf(walletAddress);
      setBalance(ethers.formatUnits(balance, decimal));
    })();

    return () => setBalance(null);
  }, [walletProvider, contractAddress, chainId]);

  return { balance };
};
