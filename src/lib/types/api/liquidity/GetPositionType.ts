interface LiquidityType {
  lowerTick: number;
  upperTick: number;
  token0: {
    name: string;
    value: string;
  };
  token1: {
    name: string;
    value: string;
  };
}

interface FeeType {
  token0: {
    name: 'usdt';
    value: string;
  };
  token1: {
    name: 'krwo';
    value: string;
  };
}

export interface MyPositionType {
  tokenId: number;
  active: boolean;
  farming: boolean;
  liquidity: LiquidityType;
  fee: {
    usdtFee: string;
    krwoFee: string;
  };
  apr: number;
}

export interface GetMyPositionsRequestType {
  chainId: number;
  walletAddress: `0x${string}`;
}

export interface GetMyPositionDetailRequestType {
  chainId: number;
  tokenId: number;
}

export interface GetMyPositionsResponseType {
  positions: MyPositionType[];
}

export interface GetPositionDetailResponseType {
  tokenId: number;
  active: boolean;
  farming: boolean;
  liquidity: LiquidityType;
  totalLiquidity: string;
  fee: FeeType;
  harvest: {
    tickKrwo: number;
    value: string;
  };
}
