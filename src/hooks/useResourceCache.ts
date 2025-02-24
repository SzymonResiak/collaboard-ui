import { useEffect, useState, useCallback, useRef } from 'react';

interface CacheItem<T> {
  data: T[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minut

interface Subscriber<T> {
  (data: T[]): void;
}

const subscribers: Record<string, Set<Subscriber<any>>> = {};

export function updateCache<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
  subscribers[key]?.forEach((callback) => callback(data));
}

export function getCacheData<T>(key: string): T[] | null {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function useResourceCache<T>(
  resourceUrl: string,
  initialData: T[] = [],
  options = { autoRefresh: true }
) {
  const [data, setData] = useState<T[]>(initialData);
  const [error, setError] = useState<Error | null>(null);
  const fetchedRef = useRef(false);

  const fetchData = useCallback(
    async (force = false) => {
      // Usuwamy duplikację requestów - jeśli dane są w cache, używamy ich
      if (!force) {
        const cachedData = localStorage.getItem(resourceUrl);
        if (cachedData) {
          const parsed = JSON.parse(cachedData) as CacheItem<T>;
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            setData(parsed.data);
            return;
          }
        }
      }

      // Nie wykonujemy dodatkowego requestu, jeśli już mamy dane
      if (!force && data.length > 0) {
        return;
      }

      try {
        const response = await fetch(resourceUrl);
        if (!response.ok) throw new Error('Failed to fetch data');

        const newData = await response.json();
        updateCache(resourceUrl, newData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    },
    [resourceUrl, data]
  );

  useEffect(() => {
    console.log(
      `[${resourceUrl}] Effect triggered, autoRefresh: ${options.autoRefresh}`
    );
    if (!subscribers[resourceUrl]) {
      subscribers[resourceUrl] = new Set();
    }

    const subscriber: Subscriber<T> = (newData: T[]) => setData(newData);
    subscribers[resourceUrl].add(subscriber);

    if (!fetchedRef.current && options.autoRefresh) {
      fetchData(false);
      fetchedRef.current = true;
    }

    return () => {
      subscribers[resourceUrl].delete(subscriber);
      if (subscribers[resourceUrl].size === 0) {
        delete subscribers[resourceUrl];
      }
    };
  }, [resourceUrl, options.autoRefresh, fetchData]);

  return {
    data,
    error,
    refresh: () => {
      console.log(`[${resourceUrl}] Manual refresh triggered`);
      return fetchData(true);
    },
  };
}
