import Decimal from "decimal.js";

export const safeCalc = {
  multiply: (v1: string | number, v2: string | number) => {
    if (!v1 || !v2) return new Decimal(0);
    if (isNaN(Number(v1)) || isNaN(Number(v2)))
      throw new Error("enter number or string");
    const _v1 = new Decimal(v1);
    const _v2 = new Decimal(v2);

    return _v1.mul(_v2);
  },

  divide: (v1: string | number, v2: string | number) => {
    if (!v1) return new Decimal(0);
    if (!v2) throw new Error("do not division with zero");

    const _v1 = new Decimal(v1);
    const _v2 = new Decimal(v2);

    return _v1.div(_v2);
  },
};
