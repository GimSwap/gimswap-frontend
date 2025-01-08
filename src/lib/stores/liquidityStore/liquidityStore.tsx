import { createStore } from 'zustand';
import { MyPositionType } from '../../types/api/liquidity/GetPositionType';

export interface PositionType {
  label: string;
  lowerTick: number;
  upperTick: number;
  apr: number;
  currentPrice: number;
}

interface LiquidityStateType {
  selectedPosition: PositionType | null;
  selectedMyPosition: MyPositionType | null;
  currentPrice: number;
  optimisticPositions: (MyPositionType & { refetchFee: () => void })[];
  refetchPositions: () => void;
}

interface LiquidityActionType {
  setSelectedPosition: (position: PositionType) => void;
  setSelectedMyPosition: (position: MyPositionType) => void;
  setCurrentPrice: (price: number) => void;
  setOptimisticPositions: (
    positions: (MyPositionType & { refetchFee: () => void })[],
  ) => void;
  setRefetchPositions: (refetch: () => void) => void;
}

export type LiquidityStoreType = LiquidityStateType & LiquidityActionType;

export const defaultInitState: LiquidityStateType = {
  selectedPosition: null,
  selectedMyPosition: null,
  currentPrice: 0,
  optimisticPositions: [],
  refetchPositions: () => {},
};

export function createLiquidityStore(
  initState: LiquidityStateType = defaultInitState,
) {
  return createStore<LiquidityStoreType>()((set) => ({
    ...initState,
    setSelectedPosition: (position) => set({ selectedPosition: position }),
    setSelectedMyPosition: (position) => set({ selectedMyPosition: position }),
    setCurrentPrice: (price) => set({ currentPrice: price }),
    setOptimisticPositions: (positions) =>
      set({ optimisticPositions: positions }),
    setRefetchPositions: (refetch) => set({ refetchPositions: refetch }),
  }));
}
