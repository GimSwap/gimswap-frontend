import { ComponentProps, FunctionComponent } from 'react';

export type OpenPopupType = <T extends FunctionComponent<any>>(
  Component: T,
  props?: Omit<ComponentProps<T>, 'open' | 'onClose'>,
  isInnerPopup?: boolean,
) => void;

export type ClosePopupType = <T extends FunctionComponent<any>>(
  Component: T,
) => void;
