"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type PopupStoreType, createPopupStore } from "./popupStore";

export type PopupStoreContextType = ReturnType<typeof createPopupStore>;

export const PopupStoreContext = createContext<
  PopupStoreContextType | undefined
>(undefined);

export interface CounterStoreProviderProps {
  children: ReactNode;
}

export const PopupStoreProvider = ({ children }: CounterStoreProviderProps) => {
  const storeRef = useRef<PopupStoreContextType>();
  if (!storeRef.current) {
    storeRef.current = createPopupStore();
  }

  return (
    <PopupStoreContext.Provider value={storeRef.current}>
      {children}
    </PopupStoreContext.Provider>
  );
};

export const usePopupStore = <T,>(
  selector: (store: PopupStoreType) => T,
): T => {
  const popupStoreContext = useContext(PopupStoreContext);

  if (!popupStoreContext) {
    throw new Error(`프로바이더 안에서 사용해야합니다.`);
  }

  return useStore(popupStoreContext, selector);
};
