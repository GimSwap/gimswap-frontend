import { createStore } from "zustand";

interface TopbarStateType {
  invert: boolean;
}

interface TopbarActionType {
  setInvert: (invert: boolean) => void;
}

export type TopbarStoreType = TopbarStateType & TopbarActionType;

export const defaultInitState: TopbarStateType = {
  invert: true,
};

export function createTopbarStore(
  initState: TopbarStateType = defaultInitState,
) {
  return createStore<TopbarStoreType>()((set) => ({
    ...initState,
    setInvert: (invert) => set({ invert }),
  }));
}
