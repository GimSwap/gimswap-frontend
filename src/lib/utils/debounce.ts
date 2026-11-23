export default function debounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 800,
) {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
