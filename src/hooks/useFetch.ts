/* eslint-disable react-hooks/use-memo, react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  refetch: () => void;
}

function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): UseFetchReturn<T> {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    let cancelled = false;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetcher();
      if (!cancelled) {
        setState({ data: result, loading: false, error: null });
      }
    } catch (err) {
      if (!cancelled) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setState({ data: null, loading: false, error: message });
      }
    }

    return () => {
      cancelled = true;
    };
  }, deps);

  useEffect(() => {
    const cleanup = fetchData();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
  };
}

export default useFetch;
