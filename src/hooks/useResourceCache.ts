import { useEffect, useState, useCallback, useRef } from 'react';

interface CacheItem<T> {
  data: T[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minut

// Dodajemy subskrybentów zmian
const subscribers: Record<string, Set<(data: unknown[]) => void>> = {};

export function updateCache<T>(key: string, data: T[]) {
  localStorage.setItem(
    key,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );

  // Powiadom wszystkich subskrybentów o zmianie
  if (subscribers[key]) {
    subscribers[key].forEach((callback) => callback(data));
  }
}

export function useResourceCache<T>(
  resourceUrl: string,
  initialData: T[] = [],
  options = { autoRefresh: true }
) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fetchedRef = useRef(false);
  const lastFetchTime = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 10000; // 10 seconds

  const fetchData = useCallback(
    async (force = false) => {
      const now = Date.now();
      console.log(`[${resourceUrl}] Attempting fetch, force: ${force}`);

      if (!force && now - lastFetchTime.current < MIN_FETCH_INTERVAL) {
        console.log(`[${resourceUrl}] Skipping fetch - too soon`);
        return;
      }

      const cachedData = localStorage.getItem(resourceUrl);
      if (!force && cachedData) {
        const parsed = JSON.parse(cachedData) as CacheItem<T>;
        if (now - parsed.timestamp < CACHE_DURATION) {
          setData(parsed.data);
          return;
        }
      }

      lastFetchTime.current = now;
      setIsLoading(true);
      try {
        const response = await fetch(resourceUrl);
        if (!response.ok) throw new Error('Failed to fetch data');

        const newData = await response.json();

        // Zapisz do localStorage i powiadom subskrybentów
        updateCache(resourceUrl, newData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    },
    [resourceUrl]
  );

  useEffect(() => {
    console.log(
      `[${resourceUrl}] Effect triggered, autoRefresh: ${options.autoRefresh}`
    );
    if (!subscribers[resourceUrl]) {
      subscribers[resourceUrl] = new Set();
    }

    subscribers[resourceUrl].add(setData);

    if (!fetchedRef.current && options.autoRefresh) {
      fetchData(false);
      fetchedRef.current = true;
    }

    return () => {
      subscribers[resourceUrl].delete(setData);
      if (subscribers[resourceUrl].size === 0) {
        delete subscribers[resourceUrl];
      }
    };
  }, [resourceUrl, options.autoRefresh, fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh: () => {
      console.log(`[${resourceUrl}] Manual refresh triggered`);
      return fetchData(true);
    },
  };
}
