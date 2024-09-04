import { useEffect, useState } from "react";

type TargetType = HTMLElement | null;
type IntersectionAction = () => void;

export type UseIntersectionObserverType = (
  options?: IntersectionObserverInit & {
    onEnter?: IntersectionAction;
    onLeave?: IntersectionAction;
  },
) => {
  setTarget: React.Dispatch<React.SetStateAction<TargetType>>;
  target: HTMLElement | null;
};

export const useIntersectionObserver: UseIntersectionObserverType = (
  options,
) => {
  const [target, setTarget] = useState<TargetType>(null);
  const {
    root,
    rootMargin = "0px",
    threshold = 0,
    onEnter,
    onLeave,
  } = options || {};

  useEffect(() => {
    if (!target) return;
    const observer: IntersectionObserver = new IntersectionObserver(
      ([entry]) => {
        console.log(entry.boundingClientRect);
        if (entry.isIntersecting) {
          if (onEnter) {
            onEnter();
          }
        } else {
          if (onLeave) {
            onLeave();
          }
        }
        // entry.
      },
      {
        root,
        rootMargin,
        threshold,
      },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [root, rootMargin, target, threshold]);

  return { setTarget, target };
};
