import DGIcon from '@/src/assets/icons/dg-swap.png';
import Chip from '@/src/components/Chip';
import Image from 'next/image';
import { PositionType } from '../../../_mock/liquidityAmount';
import { usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { insertComma } from '@/src/lib/utils/insertComma';
import { formatNumber } from '@/src/lib/utils/formatNumber';
export default function PositionInfo({
  apr,
  currentPrice,
  lowerTick,
  upperTick,
}: PositionType) {
  return (
    <section className="px-4 py-3 rounded-lg bg-black-3 flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-1">
          <Image src={DGIcon} width={24} height={24} alt="DG Icon" />
          <Chip color="black">Active</Chip>
        </div>
        <div className="flex flex-row justify-between">
          <p className="p1 font-bold">USDT-KRWO LP 0.2%</p>
          <p className="p1 font-bold text-purple-500">
            APR ≈ {Math.floor(apr * 100)}%
          </p>
        </div>
      </div>
      <hr className="border-black-5" />
      <div className="flex flex-row justify-between">
        <p className="p1 text-black-8">Min Price</p>
        <p className="p1 font-medium">
          ₩ {insertComma(formatNumber(usdtTickToKrw(lowerTick), 0))}
        </p>
      </div>
      <div className="flex flex-row justify-between">
        <p className="p1 text-black-8">Max Price</p>
        <p className="p1 font-medium">
          ₩ {insertComma(formatNumber(usdtTickToKrw(upperTick), 0))}
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
