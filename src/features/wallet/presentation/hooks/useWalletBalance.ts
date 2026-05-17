"use client";

import { useEffect, useState } from "react";

export interface AssetBalance {
  asset_type: string;
  asset_code: string | null;
  asset_issuer: string | null;
  balance: string;
  limit?: string | null;
}

export interface BalanceState {
  balance: string | null; // Native XLM balance
  balances: AssetBalance[]; // All balances
  isLoading: boolean;
  error: string | null;
}

export function useWalletBalance(publicKey: string | null) {
  const [state, setState] = useState<BalanceState>({
    balance: null,
    balances: [],
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!publicKey) return;

    setState({ balance: null, balances: [], isLoading: true, error: null });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    fetch(`${apiUrl}/stellar/balances/${publicKey}`)
      .then((res) => {
        if (!res.ok) throw new Error("Account not found");
        return res.json();
      })
      .then((data: AssetBalance[]) => {
        const xlm = data.find((b) => b.asset_type === "native");
        setState({
          balance: xlm ? parseFloat(xlm.balance).toFixed(7) : "0.00",
          balances: data,
          isLoading: false,
          error: null,
        });
      })
      .catch((err) => {
        setState({ balance: null, balances: [], isLoading: false, error: err.message });
      });
  }, [publicKey]);

  return state;
}