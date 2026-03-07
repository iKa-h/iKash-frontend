"use client";

import { useEffect, useState } from "react";

interface BalanceState {
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useWalletBalance(publicKey: string | null) {
  const [state, setState] = useState<BalanceState>({
    balance: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    if (!publicKey) return;

    setState({ balance: null, isLoading: true, error: null });

    fetch(`http://localhost:3000/stellar/balances/${publicKey}`)
      .then((res) => {
        if (!res.ok) throw new Error("Account not found");
        return res.json();
      })
      .then((data) => {
        const xlm = data.find(
          (b: { asset_type: string }) => b.asset_type === "native"
        );
        setState({
          balance: xlm ? parseFloat(xlm.balance).toFixed(7) : "0.00",
          isLoading: false,
          error: null,
        });
      })
      .catch((err) => {
        setState({ balance: null, isLoading: false, error: err.message });
      });
  }, [publicKey]);

  return state;
}