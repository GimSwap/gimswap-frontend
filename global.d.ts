import en from "./messages/ko.json";

type AllMessages = typeof en;

declare global {
  interface IntlMessages extends AllMessages {}
}
