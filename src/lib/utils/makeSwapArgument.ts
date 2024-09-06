import { AbiMethodType } from "../types/TokenType";

export const makeSwapArgument = (
  type: AbiMethodType,
  to: string,
  value: number,
  callee: string,
) => {
  switch (type) {
    case "transferAndCall":
      return [to, value, callee];
    case "transferVoucherAndCall":
      return [to, value, callee, "0x"];
  }
};
