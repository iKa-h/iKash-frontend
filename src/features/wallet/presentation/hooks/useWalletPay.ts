"use client";

import { useState } from "react";

interface SendPaymentPayload {
    destination: string;
    amount: string;
    memo?: string;
}

interface SendPaymentState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

export function useWalletPay(publicKey: string | null) {
    const [state, setState] = useState<SendPaymentState>({
        isLoading: false,
        error: null,
        success: false
    });

    const sendPayment = async (payload: SendPaymentPayload) => {
        if (!publicKey) {
            setState((s) => ({ ...s, error: 'The wallet is not connected' }));
            return;
        }

        setState({ isLoading: true, error: null, success: false });

        try {
            const res = await fetch('', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Pay error');

            setState({ isLoading: false, error: null, success: true });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error";
            setState({ isLoading: false, error: msg, success: false });
        }
    };

    return { ...state, sendPayment };

}