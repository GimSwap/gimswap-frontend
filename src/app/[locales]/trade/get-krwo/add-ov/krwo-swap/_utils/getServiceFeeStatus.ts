import { applyDecimals } from '@/src/lib/utils/calcTick';

import { NETWORK_COST } from '@/src/lib/constants/NetworkCost';
import { TOKEN_MAP } from '@/src/lib/constants/token';
import { checkIsAvailableChain } from '@/src/lib/utils/checkIsAvailableChain';
import { safeCalc } from '@/src/lib/utils/safeCalc';

interface ServiceFeeStatusProps {
  chainId: number | undefined;
  nativeBalance: string | undefined;
  isServiceFeeActive: boolean;
}

const SERVICE_FEE_STATUS = {
  sufficient: 'Sufficient',
  applied: 'Applied',
  insufficient: 'Insufficient',
} as const;

const SERVICE_FEE_LOOKUP = {
  sufficient: {
    isEnough: true,
    className: 'text-purple-500',
    text: SERVICE_FEE_STATUS.sufficient,
  },
  applied: {
    isEnough: false,
    className: 'text-purple-500',
    text: SERVICE_FEE_STATUS.applied,
  },
  insufficient: {
    isEnough: false,
    className: 'text-error',
    text: SERVICE_FEE_STATUS.insufficient,
  },
} as const;

const checkIsEnoughServiceFee = ({
  nativeBalance,
  chainId,
}: Omit<ServiceFeeStatusProps, 'isServiceFeeActive'>) => {
  if (!chainId || !nativeBalance) return false;

  if (!checkIsAvailableChain(chainId)) return false;

  const decimal = TOKEN_MAP[chainId].native.decimal;
  const networkFee = NETWORK_COST[chainId];
  const isEnough = safeCalc.isGreaterOrEqual(
    applyDecimals(nativeBalance, decimal),
    networkFee,
  );

  return isEnough;
};

export const getServiceFeeStatus = ({
  chainId,
  nativeBalance,
  isServiceFeeActive,
}: ServiceFeeStatusProps) => {
  if (checkIsEnoughServiceFee({ chainId, nativeBalance })) {
    return SERVICE_FEE_LOOKUP.sufficient;
  }
  return isServiceFeeActive
    ? SERVICE_FEE_LOOKUP.applied
    : SERVICE_FEE_LOOKUP.insufficient;
};
