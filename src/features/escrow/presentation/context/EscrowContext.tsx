"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  EscrowRecord,
  EscrowStatus,
} from "../../domain/escrow.types";

// ─── Context Shape ───────────────────────────────────────────────────────

interface EscrowContextValue {
  /** The currently active escrow in the P2P flow */
  activeEscrow: EscrowRecord | null;

  /** Set the active escrow (e.g. after initialization) */
  setActiveEscrow: (escrow: EscrowRecord | null) => void;

  /** Update just the status of the active escrow (optimistic update) */
  updateStatus: (status: EscrowStatus) => void;

  /** Store the contractId after successful initialization */
  setContractId: (contractId: string) => void;
}

const Context = createContext<EscrowContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────

export function EscrowProvider({ children }: { children: ReactNode }) {
  const [activeEscrow, setActiveEscrow] = useState<EscrowRecord | null>(null);

  const updateStatus = useCallback((status: EscrowStatus) => {
    setActiveEscrow((prev) => {
      if (!prev) return prev;
      return { ...prev, escrowStatus: status };
    });
  }, []);

  const setContractId = useCallback((contractId: string) => {
    setActiveEscrow((prev) => {
      if (!prev) return prev;
      return { ...prev, contractId };
    });
  }, []);

  return (
    <Context.Provider
      value={{ activeEscrow, setActiveEscrow, updateStatus, setContractId }}
    >
      {children}
    </Context.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────

export function useEscrowContext(): EscrowContextValue {
  const ctx = useContext(Context);
  if (!ctx)
    throw new Error("useEscrowContext must be used within EscrowProvider");
  return ctx;
}
