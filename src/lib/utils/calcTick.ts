import { formatNumber } from './formatNumber';
import { safeCalc } from './safeCalc';

export const usdtTickToKrw = (tick: string | number) => {
  return safeCalc.pow(1.0001, tick).toString();
};

export const applyDecimals = (
  value: number | string,
  decimal: number = 6,
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
}: {
  currentPrice: number;
  usdtAmount: string;
  krwAmount: string;
}) => {
  return safeCalc
    .add(
      safeCalc
        .multiply(currentPrice, applyDecimals(usdtAmount, 6, 10))
        .toString(),
      applyDecimals(krwAmount),
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
) => {
  const currentPrice = usdtTickToKrw(currentTick);
  const lowerPrice = usdtTickToKrw(lowerTick);
  const upperPrice = usdtTickToKrw(upperTick);

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
) => {
  const lowerPrice = usdtTickToKrw(lowerTick);
  const upperPrice = usdtTickToKrw(upperTick);

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
