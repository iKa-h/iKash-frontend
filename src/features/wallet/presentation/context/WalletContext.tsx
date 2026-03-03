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
import type { WalletContext, WalletState } from "../../domain/wallet.types";
import { isConnected } from "@stellar/freighter-api";

const Context = createContext<WalletContext | null>(null);

const initialState = {
    publicKey: null,
    isConnected: false,
    isLoading: false,
    error: null,
}

export function WalletProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WalletState>(initialState);

    //Intenta restaurar sesion
    useEffect(() => {
        walletService.restoreSession().then((publicKey) => {
            if(publicKey) {
                setState((s) => ({ ...s, publicKey, isConnected: true }));
            }
        });
    }, []);

    const connect = useCallback(async () => {
        setState((s) => ({ ...s, isLoading: true, error: null}));
        try {
            const publicKey = await walletService.connect();
            setState({ publicKey, isConnected: true, isLoading: false, error: null });
        } catch (err) {
            const msg = err instanceof Error ? err.message: "Error";
            setState((s) => ({ ...s, isLoading: false, error: msg}));
        }
    }, []);

    const disconnect = useCallback(() => {
        setState(initialState)
    }, []);

    return (
        <Context.Provider value={{ ...state, connect, disconnect}}>
            {children}
        </Context.Provider>
    );
}

export function useWalletContext(): WalletContext {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("useWallet debe usarse dentro de WalletProvider");
    return ctx;
}