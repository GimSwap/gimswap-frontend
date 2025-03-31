import Image from 'next/image';
import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import ChevronDownIcon from '@/public/svg/chevron/down.svg';
import CopyIcon from '@/public/svg/copy.svg';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SelectTokenPopup from '../selectTokenPopup/SelectTokenPopup';
import { defaultChain } from '@/src/lib/constants/token';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { KRWO } from '@/src/lib/constants/token';
import { useAccount } from 'wagmi';
import { copyToClipboard } from '@/src/lib/utils/copyToClipboard';

interface TokenNameProps {
  token: TokenListType | undefined;
  setSelectedToken: React.Dispatch<
    React.SetStateAction<TokenListType | undefined>
  >;
  setOppositeToken: React.Dispatch<
    React.SetStateAction<TokenListType | undefined>
  >;
}

export default function TokenName({
  token,
  setSelectedToken,
  setOppositeToken,
}: TokenNameProps) {
  const { chainId } = useAccount();
  const { openPopup } = usePopupStore((state) => state);
  const handleTokenSelect = () => {
    if (token?.symbol === 'KRWO') return;
    openPopup(SelectTokenPopup, {
      setSelectedToken,
      setOppositeToken,
    });
  };

  const getTokenIcon = () => {
    if (!token?.symbol) return null;

    const KRWOIcon =
      KRWO.icon[checkIsAvailableChain(chainId) ? chainId : defaultChain.id];

    if (token?.symbol === 'KRWO') {
      return <KRWOIcon className="w-5 h-[20px]" />;
    }

    return (
      <Image
        src={`${process.env.NEXT_PUBLIC_KAKAO_BUCKECT_URL}/tokens/icons/${token?.symbol}.svg`}
        alt={`${token.symbol} logo`}
        width={20}
        height={20}
      />
    );
  };

  const handleTokenCopy = () => {
    if (!token?.contractAddress) return;
    copyToClipboard(token.contractAddress);
  };

  return (
    <section className="flex flex-row items-center gap-1">
      <div
        className="flex flex-row items-center px-2 py-[6px] rounded-full bg-black-1 shadow-[0px_0px_5px_0px_rgba(0,0,0,0.08)] cursor-pointer"
        onClick={handleTokenSelect}
      >
        {token?.symbol ? (
          <>
            {getTokenIcon()}
            <p className="p1 ml-1 font-medium whitespace-nowrap">
              {token.symbol}
            </p>
          </>
        ) : (
          <p className="p1 text-purple-500 whitespace-nowrap font-medium">
            Select Token
          </p>
        )}
        {token?.symbol !== 'KRWO' && (
          <ChevronDownIcon className="w-4 h-[16px] stroke-purple-500 ml-[2px]" />
        )}
      </div>
      {token && (
        <CopyIcon
          className="w-4 h-4 stroke-black-8 cursor-pointer"
          onClick={handleTokenCopy}
        />
      )}
    </section>
  );
}
