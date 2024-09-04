import { createStore } from "zustand";
import React from "react";
import { ClosePopupType, OpenPopupType } from "@/src/lib/types/PopupType";

interface Popups<T = any> {
  Component: React.ComponentType<T>;
  props: T;
}

interface PopupState {
  popups: Popups[];
}

interface PopupAction {
  setPopups: (updater: (prevPopups: Popups[]) => Popups[]) => void;
  openPopup: OpenPopupType;
  closePopup: ClosePopupType;
  clearPopups: () => void;
}

export type PopupStoreType = PopupState & PopupAction;

export const defaultInitState: PopupState = {
  popups: [],
};

export function createPopupStore(initState: PopupState = defaultInitState) {
  return createStore<PopupStoreType>()((set) => {
    const closePopupLogic = (
      Component: React.ComponentType,
      unmountTime = 200,
    ) => {
      set((state) => {
        const newPopups = state.popups.map((popup) => {
          if (popup.Component === Component) {
            return {
              Component: popup.Component,
              props: { ...popup.props, open: false },
            };
          }
          return popup;
        });

        const unmountPopup = () => {
          set((state) => ({
            popups: state.popups.filter(
              (popup) => popup.Component !== Component,
            ),
          }));
        };

        if (unmountTime > 0) {
          setTimeout(unmountPopup, unmountTime);
        } else {
          unmountPopup();
        }

        return { popups: newPopups };
      });
    };

    return {
      ...initState,
      setPopups: (updater) =>
        set((state) => ({ popups: updater(state.popups) })),
      openPopup: (Component, props) => {
        set((state) => {
          const isAlreadyOpen = state.popups.some(
            (popup) => popup.Component === Component,
          );

          if (isAlreadyOpen) {
            return state;
          }

          return {
            popups: [
              ...state.popups,
              {
                Component,
                props: {
                  ...props,
                  open: true,
                  onClose: () => closePopupLogic(Component),
                },
              },
            ],
          };
        });
      },
      clearPopups: () => set({ popups: [] }),
      closePopup: (Component, unmountTime = 200) => {
        closePopupLogic(Component, unmountTime);
      },
    };
  });
}
