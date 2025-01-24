'use client';

import ChevronRightIcon from '@/public/svg/chevron/right.svg';
import OpenVoucherIcon from '@/public/svg/token/open-voucher-border.svg';
import { useAddToken } from '@/src/lib/hook/useAddToken';
import { OPEN_VOUCHER, KRWO, defaultChain } from '@/src/lib/constants/token';
import { useAccount } from 'wagmi';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
import SelectChainPopup from '@/src/components/popups/SelectChainPopup';

export default function AddTokens() {
  const { addToken } = useAddToken();
  const { openPopup } = usePopupStore((state) => state);
  const { isConnected, chainId } = useAccount();
  const _chainId = checkIsAvailableChain(chainId) ? chainId : defaultChain.id;
  const handleAddToken = async () => {
    if (!checkIsAvailableChain(chainId)) {
      openPopup(SelectChainPopup);
      return;
    }
    await addToken({
      address: OPEN_VOUCHER.contractAddress[_chainId],
      image: OPEN_VOUCHER.imageUrl[_chainId],
      symbol: OPEN_VOUCHER.symbol,
      decimals: OPEN_VOUCHER.decimal,
    });
    await addToken({
      address: KRWO.contractAddress[_chainId],
      image: KRWO.imageUrl[_chainId],
      symbol: KRWO.symbol,
      decimals: KRWO.decimal,
    });
  };

  if (!isConnected) return <></>;

  const Icon = (KRWO.icon as { [key in ChainIdType]: React.ElementType })[
    _chainId
  ];

  return (
    <section
      className="p-4 mt-4 w-full shadow-customShadow bg-black-1 rounded-2xl flex justify-between max-w-[480px] cursor-pointer mx-auto z-10 relative"
      onClick={handleAddToken}
    >
      <div className="flex items-center gap-2">
        <h5 className="font-medium text-black-8">Add Token to Wallet</h5>
        <div className="relative flex flex-row items-center">
          <OpenVoucherIcon className="z-10 w-5 h-5" />
          <Icon className="-translate-x-1 w-5 h-5" />
        </div>
      </div>
      <ChevronRightIcon className="stroke-black-8" />
    </section>
  );
}
