import DGIcon from '@/src/assets/icons/dg-swap.png';
import Image from 'next/image';
import Chip from '@/src/components/Chip';

interface PositionInfoProps {
  minTick: number;
  maxTick: number;
  apr: number;
  currentPrice: number;
  isActive: boolean;
  isFarming: boolean;
}

export default function PositionInfo({
  minTick,
  maxTick,
  apr,
  currentPrice,
  isActive,
  isFarming,
}: PositionInfoProps) {
  return (
    <section className="rounded-lg bg-black-3 px-4 py-3">
      <div className="flex flex-row items-center gap-1 mb-1">
        <Image src={DGIcon} width={24} height={24} alt="DG Icon" />
        <Chip color={isActive ? 'black' : 'gray'}>
          {isActive ? 'Active' : 'Inactive'}
        </Chip>
        {isFarming && <Chip color="blackOutline">Farming</Chip>}
      </div>
      <div className="flex flex-row justify-between">
        <p className="font-bold p1">USDT-KRWO LP 0.2%</p>
        <p className="p1 font-bold text-purple-500">
          APR ≈ {Math.floor(apr * 100)}%
        </p>
      </div>
      <hr className="border border-black-5 my-2" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <p className="p1 text-black-8">Min Price</p>
          <p className="p1 font-medium">₩ {minTick.toLocaleString()}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="p1 text-black-8">Max Price</p>
          <p className="p1 font-medium">₩ {maxTick.toLocaleString()}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="p1 text-black-8">Current Price</p>
          <p className="p1 font-medium">
            ₩ {Math.floor(currentPrice).toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  );
}
