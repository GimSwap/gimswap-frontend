"use client";

import LogoIcon from "@/public/svg/logo.svg";
import WalletConnectButton from "@/src/components/connectWallet/WalletConnectButton";
import { useTopbarStore } from "@/src/lib/stores/topbarStore/TopbarStoreProvider";
import { Link, usePathname } from "@/src/i18n/routing";

function BetaBadge() {
  return (
    <div className="absolute right-[-24px] top-[-10px] flex items-center justify-center rounded-[50px] border border-purple-500 bg-purple-50 px-[6px] py-[3px]">
      <p className="text-[8px] font-medium leading-[10px] text-purple-500">
        Beta
      </p>
    </div>
  );
}

export default function Topbar() {
  const { invert } = useTopbarStore((state) => state);
  const pathname = usePathname();

  const navbarStyle = () => {
    if (pathname === "/")
      return {
        backgroundColor: invert ? "bg-[#fff]" : "bg-[transparent]",
        logo: invert ? "invert" : "invert-0",
        menu: invert ? "invert-0" : "invert",
        menuItems: invert ? "text-black-12" : "text-black-1",
      };
    else
      return {
        backgroundColor: invert ? "bg-[#fff]" : "bg-[transparent]",
        logo: "invert",
        menu: "invert-0",
        menuItems: "text-black-12",
      };
  };

  return (
    <>
      <nav
        className={`fixed top-0 z-50 flex h-topbar w-full items-center justify-between px-4 transition-all duration-500 ${
          navbarStyle().backgroundColor
        }`}
      >
        <div className="relative flex">
          <Link href="/" className="w-fit">
            <LogoIcon
              className={`${navbarStyle().logo} relative transition-all duration-500`}
            />
            <BetaBadge />
          </Link>
        </div>

        <div className="flex flex-row justify-end gap-2">
          <div className="h-8 w-fit">
            <WalletConnectButton size="small" />
          </div>
        </div>
      </nav>
    </>
  );
}
