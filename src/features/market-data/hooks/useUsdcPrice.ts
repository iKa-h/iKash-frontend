'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchUsdcPrice } from '../services/market-data.service';
import type { UsdcPriceState } from '../types/market-data.types';

const REFRESH_INTERVAL_MS = 60000;
const STALE_THRESHOLD_MS = 120000;

export function useUsdcPrice(): UsdcPriceState {
  const [state, setState] = useState<UsdcPriceState>({
    price: null,
    isLoading: true,
    error: null,
    isStale: false,
    lastUpdated: null,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchingRef = useRef(false);

  const fetchPrice = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const price = await fetchUsdcPrice();
      setState({
        price,
        isLoading: false,
        error: null,
        isStale: false,
        lastUpdated: Date.now(),
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch price',
        isStale: prev.price !== null,
      }));
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    intervalRef.current = setInterval(fetchPrice, REFRESH_INTERVAL_MS);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchPrice();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchPrice]);

  useEffect(() => {
    if (state.lastUpdated && Date.now() - state.lastUpdated > STALE_THRESHOLD_MS) {
      setState((prev) => ({ ...prev, isStale: true }));
    }
  }, [state.lastUpdated]);

  return state;
}
