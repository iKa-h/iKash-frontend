"use client";

import { useState, useEffect, useCallback } from "react";
import { escrowService } from "../../application/escrow.service";
import type { EscrowRecord } from "../../domain/escrow.types";

interface EscrowStatusState {
  escrow: EscrowRecord | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * useEscrowStatus
 *
 * Fetches and optionally polls the live escrow status,
 * including on-chain balance from the Trustless Work API.
 *
 * @param escrowId - The iKash escrow record ID
 * @param pollIntervalMs - If provided, polls at this interval (default: disabled)
 */
export function useEscrowStatus(
  escrowId: string | null,
  pollIntervalMs?: number
) {
  const [state, setState] = useState<EscrowStatusState>({
    escrow: null,
    isLoading: false,
    error: null,
  });

  const fetchStatus = useCallback(async () => {
    if (!escrowId) return;

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const data = await escrowService.getStatus(escrowId);
      setState({ escrow: data, isLoading: false, error: null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setState((s) => ({ ...s, isLoading: false, error: msg }));
    }
  }, [escrowId]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Optional polling
  useEffect(() => {
    if (!pollIntervalMs || !escrowId) return;

    const interval = setInterval(fetchStatus, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchStatus, pollIntervalMs, escrowId]);

  const markFiatSent = useCallback(async () => {
    if (!escrowId) return;

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const data = await escrowService.markFiatSent(escrowId);
      setState({ escrow: data, isLoading: false, error: null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setState((s) => ({ ...s, isLoading: false, error: msg }));
    }
  }, [escrowId]);

  return { ...state, refetch: fetchStatus, markFiatSent };
}
