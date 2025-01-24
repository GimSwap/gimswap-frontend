import { defaultChain, KRWO, TOKEN_PAIR_ORDER_MAP } from '../constants/token';
import { USDT } from '../constants/token';
import { checkIsAvailableChain } from './checkIsAvailableChain';
import { formatNumber } from './formatNumber';
import { safeCalc } from './safeCalc';

export const usdtTickToKrw = (
  tick: string | number,
  chainId: number | undefined,
  decimal?: number,
) => {
  if (!chainId) return '0';
  const _decimal =
    USDT.decimal[checkIsAvailableChain(chainId) ? chainId : defaultChain.id] -
    KRWO.decimal;

  return safeCalc
    .multiply(
      safeCalc.pow(1.0001, tick).toString(),
      10 ** (decimal || _decimal),
    )
    .toString();
};

export const applyDecimals = (
  value: number | string,
  decimal: number,
  precision: number = 2,
) => {
  return formatNumber(
    safeCalc.divide(value, 10 ** decimal).toString(),
    precision,
  );
};

export const calcTotalLiquidity = ({
  currentPrice,
  usdtAmount,
  krwAmount,
  usdtDecimal,
}: {
  currentPrice: number;
  usdtAmount: string;
  krwAmount: string;
  usdtDecimal: number;
}) => {
  return safeCalc
    .add(
      safeCalc
        .multiply(currentPrice, applyDecimals(usdtAmount, usdtDecimal, 10))
        .toString(),
      applyDecimals(krwAmount, 6),
    )
    .toString();
};

export const calculateTokens = (
  krwoInput: string,
  usdtInput: string,
  isUsdtInput: boolean,
  currentTick: number,
  lowerTick: number,
  upperTick: number,
  chainId: number | undefined,
) => {
  if (!chainId) return { newUsdtInput: '0', newKrwoInput: '0' };
  const currentPrice = usdtTickToKrw(currentTick, chainId);
  const lowerPrice = usdtTickToKrw(lowerTick, chainId);
  const upperPrice = usdtTickToKrw(upperTick, chainId);

  const sqrtCurrentPrice = safeCalc.sqrt(currentPrice).toString();
  const sqrtLowerPrice = safeCalc.sqrt(lowerPrice).toString();
  const sqrtUpperPrice = safeCalc.sqrt(upperPrice).toString();

  let liquidity;
  let newUsdtInput = '0';
  let newKrwoInput = '0';

  if (isUsdtInput) {
    liquidity = safeCalc
      .divide(
        usdtInput,
        safeCalc
          .divide(
            safeCalc.subtract(sqrtUpperPrice, sqrtCurrentPrice).toString(),
            safeCalc.multiply(sqrtCurrentPrice, sqrtUpperPrice).toString(),
          )
          .toString(),
      )
      .toString();

    newKrwoInput = safeCalc
      .multiply(liquidity, safeCalc.subtract(sqrtCurrentPrice, sqrtLowerPrice))
      .toString();
  } else {
    liquidity = safeCalc
      .divide(
        krwoInput,
        safeCalc.subtract(sqrtCurrentPrice, sqrtLowerPrice).toString(),
      )
      .toString();

    newUsdtInput = safeCalc
      .multiply(
        liquidity,
        safeCalc
          .divide(
            safeCalc.subtract(sqrtUpperPrice, sqrtCurrentPrice).toString(),
            safeCalc.multiply(sqrtCurrentPrice, sqrtUpperPrice).toString(),
          )
          .toString(),
      )
      .toString();
  }

  return {
    newUsdtInput,
    newKrwoInput,
  };
};

export const calculateTokenDistribution = (
  krwAmount: string,
  currentPrice: number,
  lowerTick: number,
  upperTick: number,
  chainId: number,
) => {
  const lowerPrice = usdtTickToKrw(lowerTick, chainId);
  const upperPrice = usdtTickToKrw(upperTick, chainId);

  const sqrtCurrentPrice = safeCalc.sqrt(currentPrice).toString();
  const sqrtLowerPrice = safeCalc.sqrt(lowerPrice).toString();
  const sqrtUpperPrice = safeCalc.sqrt(upperPrice).toString();

  const liquidity = safeCalc
    .divide(
      krwAmount,
      safeCalc
        .add(
          safeCalc.subtract(sqrtCurrentPrice, sqrtLowerPrice).toString(),
          safeCalc
            .divide(
              safeCalc.subtract(sqrtUpperPrice, sqrtCurrentPrice).toString(),
              safeCalc.multiply(sqrtCurrentPrice, sqrtUpperPrice).toString(),
            )
            .toString(),
        )
        .toString(),
    )
    .toString();

  const usdtAmount = safeCalc
    .multiply(
      liquidity,
      safeCalc
        .divide(
          safeCalc.subtract(sqrtUpperPrice, sqrtCurrentPrice).toString(),
          safeCalc.multiply(sqrtCurrentPrice, sqrtUpperPrice).toString(),
        )
        .toString(),
    )
    .toString();

  const krwoAmount = safeCalc
    .multiply(liquidity, safeCalc.subtract(sqrtCurrentPrice, sqrtLowerPrice))
    .toString();

  return {
    usdtAmount,
    krwoAmount,
    liquidity,
  };
};

export const calcKrwPrice = (
  chainId: number | undefined,
  currentTick: number | undefined,
  amount: string | undefined,
  decimal: number,
  token: string,
) => {
  if (!checkIsAvailableChain(chainId) || !currentTick || !amount) {
    return '0';
  }

  const isReversed = TOKEN_PAIR_ORDER_MAP[chainId][token]?.base === 'krwo';

  const currentPrice = usdtTickToKrw(
    isReversed ? -currentTick : currentTick,
    chainId,
    decimal - KRWO.decimal,
  );

  return safeCalc
    .multiply(currentPrice, applyDecimals(amount, decimal, 18))
    .toString();
};
