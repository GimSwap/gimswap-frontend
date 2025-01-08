export type AbiMethodType = 'transferVoucherAndCall' | 'transferAndCall';

export interface TokenType {
  name: string;
  unit: number;
  contractAddress: string;
  icon: React.ElementType;
  imageUrl: string;
  symbol: 'OV' | 'KRWO' | 'USDT' | 'KAIA';
  method: AbiMethodType;
  decimal: number;
  color?: string;
}
