"use client";

import LogoIcon from "@/public/svg/logo.svg";
// import MenuIcon from "@/public/svg/menu.svg";
// import WalletConnectButton from "../WalletConnectButton";
import { useTopbarStore } from "@/src/lib/stores/topbarStore/TopbarStoreProvider";

export default function Topbar() {
  const { invert } = useTopbarStore((state) => state);
  return (
    <nav className="w-full h-topbar backdrop-blur-sm fixed top-0 flex items-center px-4 justify-between z-20">
      <LogoIcon className={invert ? "invert" : "invert-0"} />
      <section className="flex gap-3 items-center">
        {/* <MenuIcon className={invert ? "inver-0" : "invert"} /> */}
        {/* <WalletConnectButton /> */}
      </section>
    </nav>
  );
}
