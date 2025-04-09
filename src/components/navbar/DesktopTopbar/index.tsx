'use client';

import LogoIcon from '@/public/svg/logo.svg';
import MenuIcon from '@/public/svg/menu.svg';
// import LanguageIcon from '@/public/svg/language-2.svg';
import WalletConnectButton from '@/src/components/connectWallet/WalletConnectButton';
import { useTopbarStore } from '@/src/lib/stores/topbarStore/TopbarStoreProvider';
import { Link, usePathname } from '@/src/i18n/routing';
import { MENUS } from '@/src/lib/constants/menus';
import { useState } from 'react';
import LeftSidebar from '@/src/components/navbar/LeftSidebar';
import { useGetCurrentWallet } from '@/src/lib/hook/useGetCurrentWallet';
// import { usePopupStore } from '@/src/lib/stores/popupStore/PopupStoreProvider';
// import TranslationPopup from '@/src/app/[locales]/quick-deposit/_components/popups/TranslationPopup';

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
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  // const { openPopup } = usePopupStore((state) => state);
  const { data: currentWallet } = useGetCurrentWallet();
  const pathname = usePathname();

  const navbarStyle = () => {
    if (pathname === '/')
      return {
        backgroundColor: invert ? 'bg-[#fff]' : 'bg-[transparent]',
        logo: invert ? 'invert' : 'invert-0',
        menu: invert ? 'invert-0' : 'invert',
        menuItems: invert ? 'text-black-12' : 'text-black-1',
      };
    else
      return {
        backgroundColor: invert ? 'bg-[#fff]' : 'bg-[transparent]',
        logo: 'invert',
        menu: 'invert-0',
        menuItems: 'text-black-12',
      };
  };

  // const handleOpenTranslationPopup = () => {
  //   openPopup(TranslationPopup, {
  //     onClose: () => {},
  //   });
  // };
  return (
    <>
      <nav
        className={`fixed top-0 z-50 flex h-topbar w-full items-center justify-between px-4 transition-all duration-500 ${
          navbarStyle().backgroundColor
        }`}
      >
        <div>
          <Link href="/" className="relative w-fit">
            <LogoIcon
              className={`${navbarStyle().logo} relative transition-all duration-500`}
            />
            <BetaBadge />
          </Link>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <MenuIcon
            className={`${navbarStyle().menu} transition-all duration-500 lg:hidden`}
            onClick={() => setShowSidebar((prev) => !prev)}
          />
          {MENUS.filter((menu) => menu.title !== 'Home').map(
            ({ externalLink, title, url }) => {
              if (
                title === 'Liquidity' &&
                currentWallet?.id === 'Binance Wallet'
              )
                return;
              return (
                <Link
                  href={url}
                  className={`p1 ${
                    pathname.includes(url)
                      ? 'font-bold text-purple-500'
                      : `font-medium ${navbarStyle().menuItems}`
                  } mx-2 hidden min-w-[66px] flex-shrink-0 whitespace-nowrap text-center lg:block`}
                  target={externalLink ? '_blank' : '_self'}
                  key={title}
                >
                  {title}
                </Link>
              );
            },
          )}
        </div>

        <div className="flex flex-row justify-end gap-2">
          <div className="h-8 w-fit">
            <WalletConnectButton size="small" />
          </div>
          {/* This will be replaced with Korean work later */}
          {/* <button
            className="h-8 flex w-8 items-center justify-center rounded-lg bg-black-7"
            onClick={handleOpenTranslationPopup}
          >
            <LanguageIcon />
          </button> */}
        </div>
      </nav>
      <div className="lg:hidden">
        <LeftSidebar show={showSidebar} setShow={setShowSidebar} />
      </div>
    </>
  );
}
