import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_WITH_ICONS } from "@/src/lib/constants/menus";

export default function NavButtons() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.includes(path);

  return (
    <div className="flex flex-row justify-between">
      {MENU_WITH_ICONS.map(({ mobileTitle, url, icon }) => {
        const Icon = icon;
        return (
          <Link href={url} key={mobileTitle}>
            <div
              className={`relative flex w-16 flex-col items-center justify-center gap-0.5 ${
                isActive(url) ? "text-black-12" : "text-black-8"
              }`}
            >
              <Icon
                className={`${
                  isActive(url) ? "text-purple-500" : "text-black-7"
                }`}
              />
              <p
                className={`c0 font-medium ${
                  isActive(url) ? "text-purple-500" : "text-black-7"
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
