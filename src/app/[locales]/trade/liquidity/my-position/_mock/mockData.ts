export interface PositionType {
  tokenId: number;
  lowerTick: number;
  upperTick: number;
  apr: number;
  liquidity: string;
  fee: string;
  active: boolean;
  farming: boolean;
}

export interface MyPositionsType {
  name: string;
  liquidity: PositionType[];
}

export const mockMyPositions: MyPositionsType = {
  name: 'USDT_KRWO 0.2%',
  liquidity: [
    {
      tokenId: 1,
      lowerTick: 1387,
      upperTick: 1399,
      apr: 30.5,
      liquidity: '1000000',
      fee: '0.2',
      active: true,
      farming: true,
    },
    {
      tokenId: 2,
      lowerTick: 1382,
      upperTick: 1394,
      apr: 10.2,
      liquidity: '1000000',
      fee: '0.2',
      active: true,
      farming: true,
    },
    {
      tokenId: 3,
      lowerTick: 1377,
      upperTick: 1389,
      apr: 0,
      liquidity: '1000000',
      fee: '0.2',
      active: false,
      farming: false,
    },
    {
      tokenId: 4,
      lowerTick: 1372,
      upperTick: 1384,
      apr: 0,
      liquidity: '1000000',
      fee: '0.2',
      active: false,
      farming: false,
    },
  ],
};

export interface MyPositionDetailType {
  liquidity: {
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
  };
  fee: {
    token0: {
      name: string;
      value: string;
    };
    token1: {
      name: string;
      value: string;
    };
  };
  harvest: {
    tickKrwo: number;
    value: string;
  };
}

export const mockMyPositionDetail: MyPositionDetailType = {
  liquidity: {
    lowerTick: 1387,
    upperTick: 1399,
    token0: {
      name: 'USDT',
      value: '1000000',
    },
    token1: {
      name: 'KRWO',
      value: '1000000',
    },
  },
  fee: {
    token0: {
      name: 'USDT',
      value: '1000000',
    },
    token1: {
      name: 'KRWO',
      value: '1000000',
    },
  },
  harvest: {
    tickKrwo: 1387,
    value: '1000000',
  },
};
