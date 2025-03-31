import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU_WITH_ICONS } from '@/src/lib/constants/menus';

export default function NavButtons() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);

  return (
    <div className="flex flex-row justify-between">
      {MENU_WITH_ICONS.map(({ mobileTitle, url, icon }) => {
        const Icon = icon;
        const isDeposit = mobileTitle === 'Deposit';
        return (
          <Link href={url} key={mobileTitle}>
            <div
              className={`relative flex w-16 flex-col items-center justify-center gap-0.5 ${
                isActive(url) ? 'text-black-12' : 'text-black-8'
              }`}
            >
              {isDeposit && <QuickBadge />}
              <Icon
                className={`${
                  isActive(url) ? 'text-purple-500' : 'text-black-7'
                }`}
              />
              <p
                className={`c0 font-medium ${
                  isActive(url) ? 'text-purple-500' : 'text-black-7'
                }`}
              >
                {mobileTitle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function QuickBadge() {
  return (
    <div className="absolute top-[-21px] flex items-center justify-center rounded-[50px] bg-purple-50 px-[6px] py-[3px]">
      <p className="text-[8px] font-medium leading-[10px] text-purple-500">
        Quick
      </p>
    </div>
  );
}
