"use client";

import LogoIcon from "@/public/svg/logo.svg";
import MenuIcon from "@/public/svg/menu.svg";
import WalletConnectButton from "../WalletConnectButton";
import { useTopbarStore } from "@/src/lib/stores/topbarStore/TopbarStoreProvider";
import { Link, usePathname } from "@/src/navigation";
import { MENUS } from "@/src/lib/constants/menus";
import { useState } from "react";
import LeftSidebar from "./LeftSidebar";

export default function Topbar() {
  const { invert } = useTopbarStore((state) => state);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

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
        className={`w-full h-topbar fixed top-0 flex items-center px-4 justify-between z-20 transition-all duration-500 ${
          navbarStyle().backgroundColor
        }`}
      >
        <Link href="/">
          <LogoIcon
            className={`${navbarStyle().logo} transition-all duration-500`}
          />
        </Link>
        <section className="flex gap-3 items-center">
          <MenuIcon
            className={`${
              navbarStyle().menu
            } lg:hidden transition-all duration-500`}
            onClick={() => setShowSidebar((prev) => !prev)}
          />
          {MENUS.map(({ externalLink, title, url }) => (
            <Link
              href={url}
              className={`p1 font-medium ${
                navbarStyle().menuItems
              } min-w-[52px] hidden lg:block`}
              target={externalLink ? "_blank" : "_self"}
              key={title}
            >
              {title}
            </Link>
          ))}
          <WalletConnectButton size="small" />
        </section>
      </nav>
      <div className="lg:hidden">
        <LeftSidebar show={showSidebar} setShow={setShowSidebar} />
      </div>
    </>
  );
}
