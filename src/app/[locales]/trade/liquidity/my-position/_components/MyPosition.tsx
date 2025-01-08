import Image from 'next/image';
import { MyPositionType } from '@/src/lib/types/api/liquidity/GetPositionType';
import DGIcon from '@/src/assets/icons/dg-swap.png';
import Chip from '@/src/components/Chip';
import { insertComma } from '@/src/lib/utils/insertComma';
import { calcTotalLiquidity, usdtTickToKrw } from '@/src/lib/utils/calcTick';
import { safeCalc } from '@/src/lib/utils/safeCalc';
import { formatNumber } from '@/src/lib/utils/formatNumber';

interface MyPositionProps {
  position: MyPositionType;
  isSelected: boolean;
  currentPrice: number;
}

export default function MyPosition({
  position,
  isSelected,
  currentPrice,
}: MyPositionProps) {
  const totalLiquidity = calcTotalLiquidity({
    currentPrice,
    usdtAmount: position.liquidity.token0.value,
    krwAmount: position.liquidity.token1.value,
  });

  const totalFee = safeCalc.add(position.fee.usdtFee, position.fee.krwoFee);

  return (
    <section
      className={`p-4 border border-black-4 rounded-lg flex flex-col gap-2 mt-4 cursor-pointer ${
        isSelected ? 'border-purple-500' : ''
      }`}
    >
      <section className="flex flex-row items-center gap-1">
        <Image src={DGIcon} width={24} height={24} alt="DG Icon" />
        <Chip color={position.active ? 'black' : 'gray'}>
          {position.active ? 'Active' : 'Inactive'}
        </Chip>
        {position.farming && <Chip color="blackOutline">Farming</Chip>}
      </section>
      <p className="p1 font-bold">{`₩ ${insertComma(
        formatNumber(usdtTickToKrw(position.liquidity.lowerTick), 0),
      )} ⇌ ₩ ${insertComma(
        formatNumber(usdtTickToKrw(position.liquidity.upperTick), 0),
      )}`}</p>
      <section className="flex flex-row">
        <div className="flex-1 px-2 flex flex-col gap-1">
          <p className="c1 text-black-7">Liquidity</p>
          <p className="c1">
            ₩ {insertComma(safeCalc.floor(totalLiquidity).toString())}
          </p>
        </div>
        <div className="flex-1 px-2 border-l border-l-black-4 flex flex-col gap-1">
          <p className="c1 text-black-7">Fee</p>
          <p className="c1">{`₩ ${insertComma(
            formatNumber(totalFee.toString(), 0),
          )}`}</p>
        </div>
      </section>
      {position.apr > 0 ? (
        <p className="c1 text-center text-purple-500 bg-purple-50 rounded-[4px] py-1 px-2 font-bold">
          APR ≈ {Math.floor(position.apr * 100)}%
        </p>
      ) : null}
    </section>
  );
}
