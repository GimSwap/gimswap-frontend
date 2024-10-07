'use client';

import ChevronRightIcon from '@/public/svg/chevron/right.svg';
import OpenVoucherIcon from '@/public/svg/token/open-voucher-border.svg';
import { useAddToken } from '@/src/lib/hook/useAddToken';
import { OPEN_VOUCHER, KRWO } from '@/src/lib/constants/token';
import { useAccount } from 'wagmi';

export default function AddTokens() {
  const { addToken } = useAddToken();
  const { isConnected } = useAccount();
  const handleAddToken = () => {
    addToken({
      address: OPEN_VOUCHER.contractAddress,
      image: OPEN_VOUCHER.imageUrl,
      symbol: OPEN_VOUCHER.symbol,
      decimals: OPEN_VOUCHER.decimal,
    });
    addToken({
      address: KRWO.contractAddress,
      image: KRWO.imageUrl,
      symbol: KRWO.symbol,
      decimals: KRWO.decimal,
    });
  };

  if (!isConnected) return <></>;
  return (
    <section
      className="p-4 mt-4 w-full shadow-customShadow bg-black-1 rounded-2xl flex justify-between max-w-[480px]"
      onClick={handleAddToken}
    >
      <div className="flex items-center gap-2">
        <h5 className="font-medium text-black-8">Add Token to Wallet</h5>
        <div className="relative flex flex-row items-center">
          <OpenVoucherIcon className="z-10" />
          <KRWO.icon className="-translate-x-1" />
        </div>
      </div>
      <ChevronRightIcon />
    </section>
  );
}
