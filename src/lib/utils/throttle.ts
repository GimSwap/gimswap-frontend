import { useRef, useCallback } from 'react';

export default function throttle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 1000,
) {
  const isThrottled = useRef(false);

  return useCallback(
    (...args: Parameters<T>) => {
      if (isThrottled.current) return;

      callback(...args);
      isThrottled.current = true;

      setTimeout(() => {
        isThrottled.current = false;
      }, delay);
    },
    [callback, delay],
  );
}
