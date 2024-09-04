"use client";

import { useIntersectionObserver } from "@/src/lib/hook/useIntersectionObserver";
import { useTopbarStore } from "@/src/lib/stores/topbarStore/TopbarStoreProvider";

export default function NavbarColorChanger() {
  const { setTarget } = useIntersectionObserver({
    rootMargin: "0px 0px 0px 0px",
    threshold: 0.8,
    onEnter: () => setInvert(false),
    onLeave: () => setInvert(true),
  });
  const { setInvert } = useTopbarStore((state) => state);
  return <div ref={setTarget} />;
}
