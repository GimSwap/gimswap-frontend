'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import {
  type LiquidityStoreType,
  createLiquidityStore,
} from './liquidityStore';

export type LiquidityStoreContextType = ReturnType<typeof createLiquidityStore>;

export const LiquidityStoreContext = createContext<
  LiquidityStoreContextType | undefined
>(undefined);

export const LiquidityStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<LiquidityStoreContextType>();
  if (!storeRef.current) {
    storeRef.current = createLiquidityStore();
  }
  return (
    <LiquidityStoreContext.Provider value={storeRef.current}>
      {children}
    </LiquidityStoreContext.Provider>
  );
};
export const useLiquidityStore = <T,>(
  selector: (store: LiquidityStoreType) => T,
): T => {
  const liquidityStoreContext = useContext(LiquidityStoreContext);

  if (!liquidityStoreContext) {
    throw new Error(`프로바이더 안에서 사용해야합니다.`);
  }

  return useStore(liquidityStoreContext, selector);
};
