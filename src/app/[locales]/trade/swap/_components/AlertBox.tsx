import WarningIcon from '@/public/svg/warning.svg';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { useAccount } from 'wagmi';

interface AlertBoxProps {
  payToken: TokenListType | undefined;
  receiveToken: TokenListType | undefined;
  isPriceImpactTooHigh: boolean;
}

const TEXT_MAP = {
  invalidChain: 'Please switch to a supported network.',
  priceImpact: 'The price impact is currently too high to swap.',
};

export default function AlertBox({
  payToken,
  receiveToken,
  isPriceImpactTooHigh,
}: AlertBoxProps) {
  const { isConnected, chainId } = useAccount();
  if (!isConnected || !payToken?.symbol || !receiveToken?.symbol) return null;

  const isAvailableChain =
    checkIsAvailableChain(chainId) &&
    payToken?.chainId === chainId &&
    receiveToken?.chainId === chainId;

  if (isAvailableChain && !isPriceImpactTooHigh) return null;

  return (
    <section className="flex flex-row gap-1 items-center py-2 px-4 rounded-lg bg-[#FDEDED]">
      <WarningIcon className="w-4 h-[16px] stroke-error" />
      <p className="c1 text-error">
        {!isAvailableChain ? TEXT_MAP.invalidChain : TEXT_MAP.priceImpact}
      </p>
    </section>
  );
}
