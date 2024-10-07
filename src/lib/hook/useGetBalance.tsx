import getBalanceAbi from '@/src/lib/utils/abis/getERC20Balance.json';
import { useAccount, useReadContract } from 'wagmi';
import { safeCalc } from '@/src/lib/utils/safeCalc';

interface GetBalanceProps {
  contractAddress: string;
  decimal: number;
}

export const getBalance = ({ contractAddress, decimal }: GetBalanceProps) => {
  const { address } = useAccount();

  const { data: balance, isPending } = useReadContract({
    abi: getBalanceAbi,
    address: contractAddress as `0x${string}`,
    functionName: 'balanceOf',
    args: [address],
  });

  if (isPending || !balance) return { balance: 0 };

  const formattedDecimal = safeCalc.pow(10, decimal).toString();
  const formattedBalance = safeCalc
    .divide(balance.toString(), formattedDecimal)
    .toString();

  return { balance: formattedBalance };
};
