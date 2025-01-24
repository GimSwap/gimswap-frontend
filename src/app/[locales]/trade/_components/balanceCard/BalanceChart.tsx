import { defaultChain, TOKEN_MAP } from '@/src/lib/constants/token';

import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';

import { KRWO, USDT } from '@/src/lib/constants/token';
import BarChartAndInfo from '../../liquidity/my-position/_components/myPositionDetail/BarChartAndInfo';
import { applyDecimals } from '@/src/lib/utils/calcTick';
import { ChainIdType } from '@/src/lib/types/ChainIdType';
import { GetBalanceResponseType } from '@/src/lib/types/api/GetBalanceType';
import { useAccount } from 'wagmi';

interface BalanceChartProps {
  balance: GetBalanceResponseType['balance'] | undefined;
  nativePrice: string;
  usdtPrice: string;
  rewardAmount: string;
}

export default function BalanceChart({
  balance,
  nativePrice,
  usdtPrice,
  rewardAmount,
}: BalanceChartProps) {
  const { chainId } = useAccount();

  const defaultTokens = [
    {
      ...KRWO,
      amount: applyDecimals(balance?.krwo || '0', KRWO.decimal),
      icon: KRWO.icon[
        checkIsAvailableChain(chainId) ? chainId : defaultChain.id
      ],
      value: balance?.krwo || '0',
      color:
        KRWO.color[checkIsAvailableChain(chainId) ? chainId : defaultChain.id],
    },
    {
      ...USDT,
      icon: USDT.icon as React.ElementType,
      color: USDT.color as string,
      amount: usdtPrice || '0',
      value: balance?.usdt || '0',
    },
    {
      ...TOKEN_MAP[chainId as ChainIdType].native,
      icon: TOKEN_MAP[chainId as ChainIdType].native.icon as React.ElementType,
      amount: nativePrice || '0',
      value: balance?.native || '0',
      color: TOKEN_MAP[chainId as ChainIdType].native.color,
    },
  ];

  const tokens = TOKEN_MAP[chainId as ChainIdType].native.supportFarming
    ? [
        ...defaultTokens,
        {
          ...TOKEN_MAP[chainId as ChainIdType].reward,
          icon: TOKEN_MAP[chainId as ChainIdType].reward
            .icon as React.ElementType,
          amount: rewardAmount || '0',
          value: balance?.reward || '0',
          color: '#8C8C8C',
        },
      ]
    : defaultTokens;

  return (
    <BarChartAndInfo
      title=""
      subTitle="Balance "
      symbolStyle={{
        className: '!justify-start gap-2',
        showPercentage: false,
      }}
      tokens={tokens}
    />
  );
}
