export type AbiMethodType = "transferVoucherAndCall" | "transferAndCall";

export interface TokenType {
  name: string;
  unit: number;
  contractAddress: string;
  icon: React.ElementType;
  imageUrl: string;
  symbol: string;
  method: AbiMethodType;
  decimal: number;
}
