import Image from 'next/image';
import { defaultChain, KRWO, OPEN_VOUCHER } from '../lib/constants/token';
import { checkIsAvailableChain } from '../lib/utils/checkIsAvailableChain';

interface TokenIconProps {
  symbol: string;
  width: number;
  height: number;
  alt: string;
  chainId?: number;
  className?: string;
}

export default function TokenIcon({
  symbol,
  width,
  height,
  alt,
  className,
  chainId,
}: TokenIconProps) {
  if (symbol === 'OV') {
    const OVIcon = OPEN_VOUCHER.icon;
    return <OVIcon className={`${className} w-[${width}px] h-[${height}px]`} />;
  }

  if (chainId && symbol === 'KRWO') {
    const KRWOIcon =
      KRWO.icon[checkIsAvailableChain(chainId) ? chainId : defaultChain.id];

    return (
      <KRWOIcon className={`${className} w-[${width}px] h-[${height}px]`} />
    );
  }

  return (
    <Image
      src={`${process.env.NEXT_PUBLIC_KAKAO_BUCKECT_URL}/tokens/icons/${symbol}.svg`}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
