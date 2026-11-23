export const formatNumber = (value: string, decimal: number = 6) => {
  if (!value.includes('.')) return value;

  const [integerPart, decimalPart] = value.split('.');
  const truncatedDecimal = decimalPart.slice(0, decimal);

  const isZeroDecimal = !truncatedDecimal || /^0*$/.test(truncatedDecimal);
  return isZeroDecimal ? integerPart : `${integerPart}.${truncatedDecimal}`;
};
