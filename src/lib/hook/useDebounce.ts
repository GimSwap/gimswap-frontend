import { useState, useEffect, useRef, useCallback } from 'react';

export function useDebounce<T>(
  value: T,
  delay: number = 500,
): {
  debouncedValue: T;
  resetDebouncedValue: () => void;
  isDebouncing: boolean;
} {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetDebouncedValue = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDebouncedValue(undefined as T);
  }, []);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDebouncing(true);

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);

  return { debouncedValue, resetDebouncedValue, isDebouncing };
}
