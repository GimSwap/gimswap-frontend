import { ElementType } from 'react';
import { chains } from '../wagmi';

type ChainIdType = (typeof chains)[number]['id'];

type BaseTokenType = {
  name: string;
  unit: number;
  contractAddress: {
    [key in ChainIdType]: string;
  };
  symbol: string;
  method: string;
};

type SingleProfileToken = BaseTokenType & {
  icon: ElementType;
  imageUrl: string;
  color: string;
  decimal: number;
  multiProfile: false;
  multiDecimal: false;
};

type MultiProfileToken = BaseTokenType & {
  icon: {
    [key in ChainIdType]: ElementType;
  };
  imageUrl: {
    [key in ChainIdType]: string;
  };
  color: {
    [key in ChainIdType]: string;
  };
  decimal: number;
  multiProfile: true;
  multiDecimal: false;
};

type MultiDecimalToken = BaseTokenType & {
  icon: ElementType;
  imageUrl: string;
  color: string;
  decimal: {
    [key in ChainIdType]: number;
  };
  multiProfile: false;
  multiDecimal: true;
};

export type TokenType =
  | SingleProfileToken
  | MultiProfileToken
  | MultiDecimalToken;

export function createToken<T extends TokenType>(params: T): T {
  const chainIds = chains.map((chain) => chain.id);

  if (params.multiProfile) {
    return {
      ...params,
      icon:
        typeof params.icon === 'function'
          ? Object.fromEntries(chainIds.map((id) => [id, params.icon]))
          : params.icon,
      imageUrl:
        typeof params.imageUrl === 'string'
          ? Object.fromEntries(chainIds.map((id) => [id, params.imageUrl]))
          : params.imageUrl,
      color:
        typeof params.color === 'string'
          ? Object.fromEntries(chainIds.map((id) => [id, params.color]))
          : params.color,
    } as T;
  }

  if (params.multiDecimal) {
    return {
      ...params,
      decimal:
        typeof params.decimal === 'number'
          ? Object.fromEntries(chainIds.map((id) => [id, params.decimal]))
          : params.decimal,
    } as T;
  }

  return params;
}
