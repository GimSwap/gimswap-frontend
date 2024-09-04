"use client";

import { usePopupStore } from "@/src/lib/stores/popupStore/PopupStoreProvider";
import { usePathname } from "@/src/navigation";
import { useEffect } from "react";

export default function PopupList() {
  const { popups, clearPopups } = usePopupStore((state) => state);
  const pathname = usePathname();
  useEffect(() => {
    clearPopups();
  }, [pathname]);
  return (
    <>
      {popups.map(({ Component, props }) => (
        <div id={`popup-${Component.name}`} key={Component.name}>
          <Component {...props} />
        </div>
      ))}
    </>
  );
}
