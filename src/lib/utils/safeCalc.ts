import Decimal from 'decimal.js';

Decimal.set({ precision: 20, toExpNeg: -9e15, toExpPos: 9e15 });

export const safeCalc = {
  multiply: (v1: string | number | Decimal, v2: string | number | Decimal) => {
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

  isGreater: (v1: string | number, v2: string | number) => {
    const _v1 = new Decimal(v1 || 0);
    const _v2 = new Decimal(v2 || 0);

    return _v1.greaterThan(_v2);
  },

  pow: (v1: string | number, v2: string | number) => {
    const _v1 = new Decimal(v1 || 0);
    const _v2 = new Decimal(v2 || 0);
    return _v1.pow(_v2);
  },

  add: (v1: string | number, v2: string | number) => {
    const _v1 = new Decimal(v1 || 0);
    const _v2 = new Decimal(v2 || 0);

    return _v1.add(_v2);
  },

  subtract: (v1: string | number, v2: string | number) => {
    const _v1 = new Decimal(v1 || 0);
    const _v2 = new Decimal(v2 || 0);

    return _v1.sub(_v2);
  },

  min: (array: string[] | number[]) => {
    if (!array.length) return new Decimal(0);
    return array.reduce(
      (min, value) => Decimal.min(min, new Decimal(value)),
      new Decimal(array[0]),
    );
  },

  max: (array: string[] | number[]) => {
    if (!array.length) return new Decimal(0);
    return array.reduce(
      (max, value) => Decimal.max(max, new Decimal(value)),
      new Decimal(array[0]),
    );
  },

  floor: (value: string | number) => {
    const _value = new Decimal(value);
    return _value.floor();
  },

  sqrt: (value: string | number) => {
    const _value = new Decimal(value);
    return _value.sqrt();
  },

  equal: (v1: string | number, v2: string | number) => {
    const _v1 = new Decimal(v1 || 0);
    const _v2 = new Decimal(v2 || 0);

    return _v1.eq(_v2);
  },
};
