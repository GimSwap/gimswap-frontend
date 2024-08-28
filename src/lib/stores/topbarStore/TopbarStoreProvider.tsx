"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type TopbarStoreType, createTopbarStore } from "./topbarStore";

export type TopbarNumberStoreContextType = ReturnType<typeof createTopbarStore>;

export const TopbarStoreContext = createContext<
  TopbarNumberStoreContextType | undefined
>(undefined);

export const TopbarStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<TopbarNumberStoreContextType>();
  if (!storeRef.current) {
    storeRef.current = createTopbarStore();
  }
  return (
    <TopbarStoreContext.Provider value={storeRef.current}>
      {children}
    </TopbarStoreContext.Provider>
  );
};
export const useTopbarStore = <T,>(
  selector: (store: TopbarStoreType) => T,
): T => {
  const topbarStoreContext = useContext(TopbarStoreContext);

  if (!topbarStoreContext) {
    throw new Error(`프로바이더 안에서 사용해야합니다.`);
  }

  return useStore(topbarStoreContext, selector);
};
