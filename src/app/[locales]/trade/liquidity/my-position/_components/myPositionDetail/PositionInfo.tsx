import Image from 'next/image';
import Chip from '@/src/components/Chip';
import { DEX_ICON_MAP } from '@/src/lib/constants/dex';
import { LP_MAP, LPINFO } from '@/src/lib/constants/pools';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { defaultChain } from '@/src/lib/constants/token';
import { useAccount } from 'wagmi';
import QuestionMarkIcon from '@/public/svg/circle-question-purple.svg';
import { useToolTip } from '@/src/lib/hook/useToolTip';

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
  const { chainId } = useAccount();
  const { openTooltip, Tooltip } = useToolTip();

  let lpInfo: LPINFO;

  if (chainId) {
    lpInfo = LP_MAP[chainId];
  } else {
    lpInfo = {
      name: '',
      fee: 0,
      provider: '',
    };
  }
  return (
    <section className="rounded-lg bg-black-3 px-4 py-3">
      <div className="flex flex-row items-center gap-1 mb-1">
        <Image
          src={
            DEX_ICON_MAP[
              checkIsAvailableChain(chainId) ? chainId : defaultChain.id
            ]
          }
          width={24}
          height={24}
          alt="DG Icon"
        />
        <Chip color={isActive ? 'black' : 'gray'}>
          {isActive ? 'Active' : 'Inactive'}
        </Chip>
        {isFarming && <Chip color="blackOutline">Farming</Chip>}
      </div>
      <div className="flex flex-row justify-between">
        <p className="font-bold p1">
          {lpInfo.name} LP {lpInfo.fee}%
        </p>
        <div className="flex items-center gap-[2px]" onClick={openTooltip}>
          <QuestionMarkIcon />
          <Tooltip className="whitespace-nowrap bg-[rgba(0,0,0,0.5)] rounded-lg px-3 py-[6px] text-black-1 c1 after:left-[50%] -translate-x-[90px] translate-y-[70px]">
            This figure is based on the last <br />
            24 hours' trading volume and <br />
            may change due to factors like <br />
            total liquidity and additional <br />
            liquidity. It does not guarantee <br />
            returns and is for reference only.
          </Tooltip>
          <p className="p1 font-bold text-purple-500">
            APR ≈ {Math.floor(apr * 100)}%
          </p>
        </div>
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
