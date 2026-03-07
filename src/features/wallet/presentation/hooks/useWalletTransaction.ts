"use client";

import { useEffect, useState } from "react";

export interface Transaction {
    id: string;
    hash: string;
    created_at: string;
    memo_type: string;
    memo?: string;
    successful: boolean;
    fee_charged: string;
    source_account: string;
}

interface TransactionsState {
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;
}

export function useWalletTransactions(publicKey: string | null) {
    const [state, setState] = useState<TransactionsState>({
        transactions: [],
        isLoading: false,
        error: null,
    });

    useEffect(() => {
        if (!publicKey) return;

        setState({ transactions: [], isLoading: true, error: null });

        fetch(`http://localhost:3000/stellar/transactions/${publicKey}`)
            .then((res) => {
                if (!res.ok) throw new Error("Transacciones no encontradas");
                return res.json();
            })
            .then((data: Transaction[]) => {
                setState({ transactions: data, isLoading: false, error: null });
            })
            .catch((err) => {
                setState({ transactions: [], isLoading: false, error: err.message });
            });
    }, [publicKey]);

    return state;
}