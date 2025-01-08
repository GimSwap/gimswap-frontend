export default function throttle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 1000,
) {
  let isThrottled = false;

  return (...args: Parameters<T>) => {
    if (isThrottled) return;

    callback(...args);
    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
    }, delay);
  };
}
