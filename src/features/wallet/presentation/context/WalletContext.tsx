"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { walletService } from "../../application/wallet.service";
import type { WalletContext, WalletState, WalletProvider } from "../../domain/wallet.types";
import { useRouter } from "next/navigation";

const Context = createContext<WalletContext | null>(null);

const initialState: WalletState = {
    publicKey: null,
    provider: null,
    isConnected: false,
    isLoading: false,
    error: null,
};

export function WalletProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WalletState>(initialState);

    // Restaura sesión al montar
    useEffect(() => {
        walletService.restoreSession().then((session) => {
            if (session) {
                setState((s) => ({
                    ...s,
                    publicKey: session.publicKey,
                    provider: session.provider,
                    isConnected: true,
                }));
            }
        });
    }, []);

    const router = useRouter();

    const connect = useCallback(async (provider: WalletProvider) => {
        setState((s) => ({ ...s, isLoading: true, error: null }));
        try {
            const publicKey = await walletService.connect(provider);
            setState({ publicKey, provider, isConnected: true, isLoading: false, error: null });
            router.push("/dashboard");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error desconocido";
            setState((s) => ({ ...s, isLoading: false, error: msg }));
        }
    }, []);

    const disconnect = useCallback(() => {
        walletService.clearSession();
        setState(initialState);
    }, []);

    return (
        <Context.Provider value={{ ...state, connect, disconnect }}>
            {children}
        </Context.Provider>
    );
}

export function useWalletContext(): WalletContext {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("useWalletContext debe usarse dentro de WalletProvider");
    return ctx;
}