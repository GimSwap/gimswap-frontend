import Decimal from "decimal.js";

export const safeCalc = {
  multiply: (v1: string | number, v2: string | number) => {
    if (!v1 || !v2) return new Decimal(0);
    const _v1 = new Decimal(v1);
    const _v2 = new Decimal(v2);

    return _v1.mul(_v2);
  },

  divide: (v1: string | number, v2: string | number) => {
    if (!v1) return new Decimal(0);
    if (!v2) return new Decimal(Infinity);

    const _v1 = new Decimal(v1);
    const _v2 = new Decimal(v2);

    return _v1.div(_v2);
  },

  isGreaterOrEqual: (v1: string | number, v2: string | number) => {
    const _v1 = new Decimal(v1 || 0);
    const _v2 = new Decimal(v2 || 0);

    return _v1.greaterThanOrEqualTo(_v2);
  },

  pow: (v1: string | number, v2: string | number) => {
    const _v1 = new Decimal(v1);
    const _v2 = new Decimal(v2);

    return _v1.pow(_v2);
  },
};
