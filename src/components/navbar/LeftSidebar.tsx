import LogoIcon from "@/public/svg/logo.svg";
import { MENUS } from "@/src/lib/constants/menus";
import { Link, usePathname } from "@/src/navigation";
import WalletConnectButton from "../WalletConnectButton";
import Socials from "./Footer/Socials";

interface LeftSidebarProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftSidebar({ show, setShow }: LeftSidebarProps) {
  const pathname = usePathname();
  return (
    <>
      <section
        className={`fixed top-0 w-[100vw] h-[100dvh] bg-[rgba(33,33,33,0.3)] z-[21] ${
          show ? "block" : "hidden"
        }`}
        onClick={() => setShow(false)}
      />
      <section
        className={`fixed top-0 left-0 h-[100dvh] bg-black-1 w-[70%] z-[22] text-white max-w-[500px] 
        transform transition-transform duration-300
        ${show ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="pt-8 pl-4 pb-6">
          <LogoIcon className="invert" />
        </div>
        <section className="flex flex-col">
          {MENUS.map(({ externalLink, title, url }) => {
            const isActive = url === pathname;
            return (
              <Link
                href={url}
                className={`${
                  isActive ? "text-black-1 bg-purple-500" : "text-black-8"
                } py-[14px] px-6 font-bold`}
                target={externalLink ? "_blank" : "_self"}
                onClick={() => setShow(false)}
                key={url}
              >
                {title}
                {title === "Swap" && (
                  <span className="c1 text-black-7 font-normal py-1 px-2 bg-black-3 rounded-full ml-2">
                    OV ↔ TOT
                  </span>
                )}
              </Link>
            );
          })}
        </section>
        <section className="absolute bottom-8 px-6 flex flex-col w-full justify-center">
          <WalletConnectButton />
          <hr className="text-black-4 my-6" />
          <section className="flex flex-row justify-center">
            <Socials />
          </section>
        </section>
      </section>
    </>
  );
}
