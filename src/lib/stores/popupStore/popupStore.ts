import { createStore } from 'zustand';
import React from 'react';
import { ClosePopupType, OpenPopupType } from '@/src/lib/types/PopupType';

interface Popups<T = any> {
  Component: React.ComponentType<T>;
  props: T;
}

interface PopupState {
  popups: Popups[];
  innerPopups: Popups[];
}

interface PopupAction {
  openPopup: OpenPopupType;
  closePopup: ClosePopupType;
  clearPopups: (isInner?: boolean) => void;
  closeAllPopup: () => void;
  unmountPopup: (isInner?: boolean) => void;
}

export type PopupStoreType = PopupState & PopupAction;

export const defaultInitState: PopupState = {
  popups: [],
  innerPopups: [],
};

export function createPopupStore(initState: PopupState = defaultInitState) {
  return createStore<PopupStoreType>()((set, get) => {
    const handleClosePopup = (
      Component: React.ComponentType,
      isInner: boolean = false,
    ) => {
      set((state) => {
        const _popups = isInner ? state.innerPopups : state.popups;

        const newPopups = _popups.map((popup) => {
          if (popup.Component === Component) {
            return {
              Component: popup.Component,
              props: { ...popup.props, open: false },
            };
          }
          return popup;
        });
        return isInner ? { innerPopups: newPopups } : { popups: newPopups };
      });
    };

    const handleUnmountPopup = (isInner = false) => {
      set((state) => {
        const _popups = isInner ? state.innerPopups : state.popups;
        const newPopups = _popups.filter((popup) => popup.props.open);
        return isInner ? { innerPopups: newPopups } : { popups: newPopups };
      });
    };

    const handleOpenPopup = (
      Component: React.ComponentType,
      props: any,
      isInner: boolean = false,
    ) => {
      set((state) => {
        const _popups = isInner ? state.innerPopups : state.popups;
        const isAlreadyOpen = _popups.some(
          (popup) => popup.Component === Component,
        );

        if (isAlreadyOpen) {
          return state;
        }

        const newPopups = [
          ..._popups,
          {
            Component,
            props: {
              ...props,
              open: true,
              onClose: () => handleClosePopup(Component, isInner),
            },
          },
        ];
        return isInner ? { innerPopups: newPopups } : { popups: newPopups };
      });
    };

    const handleCloseAllPopup = () => {
      get().popups.forEach((popup) => {
        handleClosePopup(popup.Component);
      });
      get().innerPopups.forEach((popup) => {
        handleClosePopup(popup.Component, true);
      });
      handleUnmountPopup();
    };

    return {
      ...initState,
      openPopup: handleOpenPopup,
      closePopup: handleClosePopup,
      closeAllPopup: handleCloseAllPopup,
      clearPopups: (isInner = false) =>
        set(() => {
          return isInner ? { innerPopups: [] } : { popups: [] };
        }),
      unmountPopup: handleUnmountPopup,
    };
  });
}
