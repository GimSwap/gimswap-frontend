import Chip from '@/src/components/Chip';
import Image from 'next/image';
import { PositionType } from '../../../_mock/liquidityAmount';
import { usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { insertComma } from '@/src/lib/utils/insertComma';
import { formatNumber } from '@/src/lib/utils/formatNumber';
import { useAccount } from 'wagmi';
import { DEX_ICON_MAP } from '@/src/lib/constants/dex';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { defaultChain } from '@/src/lib/constants/token';
import { LP_MAP, LPINFO } from '@/src/lib/constants/pools';
export default function PositionInfo({
  apr,
  currentPrice,
  lowerTick,
  upperTick,
}: PositionType) {
  const { chainId } = useAccount();
  const dexIcon =
    DEX_ICON_MAP[checkIsAvailableChain(chainId) ? chainId : defaultChain.id];
  let lpInfo: LPINFO;

  if (chainId) {
    lpInfo = LP_MAP[chainId]
  } else {
    lpInfo = {
      name: "", fee: 0, provider: ""
    }
  }

  return (
    <section className="px-4 py-3 rounded-lg bg-black-3 flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-1">
          <Image src={dexIcon} width={24} height={24} alt="DG Icon" />
          <Chip color="black">Active</Chip>
        </div>
        <div className="flex flex-row justify-between">
          <p className="p1 font-bold">{lpInfo.name} LP {lpInfo.fee}%</p>
          <p className="p1 font-bold text-purple-500">
            APR ≈ {Math.floor(apr * 100)}%
          </p>
        </div>
      </div>
      <hr className="border-black-5" />
      <div className="flex flex-row justify-between">
        <p className="p1 text-black-8">Min Price</p>
        <p className="p1 font-medium">
          ₩ {insertComma(formatNumber(usdtTickToKrw(lowerTick, chainId), 0))}
        </p>
      </div>
      <div className="flex flex-row justify-between">
        <p className="p1 text-black-8">Max Price</p>
        <p className="p1 font-medium">
          ₩ {insertComma(formatNumber(usdtTickToKrw(upperTick, chainId), 0))}
        </p>
      </div>
      <div className="flex flex-row justify-between">
        <p className="p1 text-black-8">Current Price</p>
        <p className="p1 font-bold">
          ₩ {Math.floor(currentPrice).toLocaleString()}
        </p>
      </div>
    </section>
  );
}
