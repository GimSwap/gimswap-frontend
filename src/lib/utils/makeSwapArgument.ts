export const makeSwapArgument = (
  type: string,
  to: string,
  value: BigInt,
  callee: string,
) => {
  switch (type) {
    case 'transferAndCall':
      return [to, value, callee];
    case 'transferVoucherAndCall':
      return [to, value, callee, '0x'];
  }
};
