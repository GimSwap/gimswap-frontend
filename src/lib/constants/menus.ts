import KrwoIcon from "@/public/svg/bitcoin-03.svg";

export const MENUS = [
  {
    title: "Home",
    mobileTitle: "Home",
    url: "/",
    externalLink: false,
  },
  {
    title: "Swap KRWO",
    mobileTitle: "Swap KRWO",
    url: "/trade/get-krwo",
    externalLink: false,
  },
] as const;

export const MENU_ICONS = {
  "Swap KRWO": KrwoIcon,
} as const;

export type MenuType = (typeof MENUS)[number];
export type MenuTitleType = MenuType["title"];
export type MobileTitleType = MenuType["mobileTitle"];

export const MENU_WITH_ICONS = MENUS.filter(
  (menu) => menu.title !== "Home",
).map((menu) => ({
  ...menu,
  icon: MENU_ICONS[menu.title],
}));
