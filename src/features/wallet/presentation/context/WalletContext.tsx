"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { walletService } from "../../application/wallet.service";
import type { WalletContext, WalletState, WalletProvider } from "../../domain/wallet.types";
import { useRouter } from "next/navigation";
import { useUsers } from "../../../user/hooks/useUsers";
import { useUser } from "../../../user/presentation/context/UserContext";

const Context = createContext<WalletContext | null>(null);

const initialState: WalletState = {
    publicKey: null,
    provider: null,
    isConnected: false,
    isLoading: true,
    error: null,
};

export function WalletProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<WalletState>(initialState);

    const router = useRouter();
    const { getOrCreateByWallet } = useUsers();
    const { setCurrentUser, setAccessToken, logout } = useUser();

    // Use refs to avoid stale closures in useEffect without triggering re-runs
    const getOrCreateRef = useRef(getOrCreateByWallet);
    const setCurrentUserRef = useRef(setCurrentUser);
    useEffect(() => { getOrCreateRef.current = getOrCreateByWallet; }, [getOrCreateByWallet]);
    useEffect(() => { setCurrentUserRef.current = setCurrentUser; }, [setCurrentUser]);

    // Restaura sesión al montar (runs once)
    useEffect(() => {
        let cancelled = false;
        walletService.restoreSession().then(async (session) => {
            if (cancelled || !session?.publicKey) {
                if (!cancelled) setState((s) => ({ ...s, isLoading: false }));
                return
            };

            setState((s) => ({
                ...s,
                publicKey: session.publicKey,
                provider: session.provider,
                isConnected: true,
                isLoading: false,
            }));

            try {
                const userAccount = await getOrCreateRef.current(session.publicKey);
                if (!cancelled && userAccount) {
                    setCurrentUserRef.current(userAccount);
                }
            } catch {
                // Backend might not be running yet; user data stays from localStorage
            }
        });
        return () => { cancelled = true; };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const connect = useCallback(async (provider: WalletProvider) => {
        setState((s) => ({ ...s, isLoading: true, error: null }));
        try {
            const publicKey = await walletService.connect(provider);
            setState({ publicKey, provider, isConnected: true, isLoading: false, error: null });
            
            // Auth logic: Get temporary JWT
            const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicKey }),
            });
            if (loginRes.ok) {
                const { access_token } = await loginRes.json();
                setAccessToken(access_token);
            }

            // Onboarding logic
            const userAccount = await getOrCreateByWallet(publicKey);
            if (userAccount) {
                setCurrentUser(userAccount);
                if (userAccount.pendingAccountInfo) {
                    router.push("/setupAccount");
                } else {
                    router.push("/dashboard");
                }
            } else {
                router.push("/dashboard");
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error desconocido";
            setState((s) => ({ ...s, isLoading: false, error: msg }));
        }
    }, [getOrCreateByWallet, setCurrentUser, setAccessToken, router]);

    const disconnect = useCallback(() => {
        walletService.clearSession();
        logout();
        setState(initialState);
    }, [logout]);

    const signTransaction = useCallback(async (xdr: string, network?: string) => {
        return await walletService.signTransaction(xdr, network);
    }, []);

    return (
        <Context.Provider value={{ ...state, connect, disconnect, signTransaction }}>
            {children}
        </Context.Provider>
    );
}

export function useWalletContext(): WalletContext {
    const ctx = useContext(Context);
    if (!ctx) throw new Error("useWalletContext debe usarse dentro de WalletProvider");
    return ctx;
}