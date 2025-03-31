import { TokenListType } from '@/src/lib/types/api/swap/GetTokenList';
import Image from 'next/image';
import { setRecentUsedToken } from '../../_utils/handleRecentToken';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SelectTokenPopup from './SelectTokenPopup';

interface TokenInfoProps {
  token: TokenListType;
  balance: string | undefined;
  setSelectedToken: (token: TokenListType) => void;
  selectedChainId: number;
}

export default function TokenInfo({
  token,
  balance,
  setSelectedToken,
  selectedChainId,
}: TokenInfoProps) {
  const { closePopup } = usePopupStore((state) => state);
  const handleClick = () => {
    setSelectedToken(token);
    setRecentUsedToken({ token, chainId: selectedChainId });
    closePopup(SelectTokenPopup);
  };

  return (
    <section
      className="py-3 flex flex-row cursor-pointer w-full justify-between"
      onClick={handleClick}
    >
      <div className="flex flex-row gap-3">
        <Image
          src={`${process.env.NEXT_PUBLIC_KAKAO_BUCKECT_URL}/tokens/icons/${token.symbol}.svg`}
          alt={token.symbol}
          width={40}
          height={40}
        />
        <div className="flex flex-col gap-1">
          <p className="p1 font-medium">{token.symbol}</p>
          <p className="c1 text-black-7">{token.name}</p>
        </div>
      </div>
      <p className="p1 font-medium text-black-8">{balance}</p>
    </section>
  );
}
