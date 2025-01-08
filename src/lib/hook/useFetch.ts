import { useState, useEffect, useCallback } from 'react';

interface UseFetchResult<T> {
  data: T;
  loading: boolean;
  error: Error | null;
}

type FetchFunction<T> = () => Promise<T>;

export function useFetch<T>(
  fetchFunction: FetchFunction<T>,
): UseFetchResult<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const memoizedFetchFunction = useCallback(fetchFunction, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const response: T = await fetchFunction();
        setData(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [memoizedFetchFunction]);

  return { data: data as T, loading, error };
}
