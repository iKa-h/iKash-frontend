import { freighterAdapter } from "../infrastructure/freighter.adapter";
import { lobstrAdapter } from "../infrastructure/lobstr.adapter";
import type { WalletProvider } from "../domain/wallet.types";

// recupera la ultima wallet usada
const STORAGE_KEY = "wallet:provider";

export const walletService = {
    //Intenta restaurar la sesión de la última wallet conectada
    async restoreSession(): Promise<{ publicKey: string; provider: WalletProvider } | null> {
        const savedProvider = localStorage.getItem(STORAGE_KEY) as WalletProvider | null;
        if (!savedProvider) return null;

        if (savedProvider === "freighter") {
            const installed = await freighterAdapter.isInstalled();
            if (!installed) return null;
            const allowed = await freighterAdapter.isAllowed();
            if (!allowed) return null;
            const publicKey = await freighterAdapter.getAddress();
            if (!publicKey) return null;
            return { publicKey, provider: "freighter" };
        }

        if (savedProvider === "lobstr") {
            const installed = await lobstrAdapter.isInstalled();
            if (!installed) return null;
            const publicKey = await lobstrAdapter.getPublicKey();
            if (!publicKey) return null;
            return { publicKey, provider: "lobstr" };
        }

        return null;
    },

    //Conecta la wallet indicada
    async connect(provider: WalletProvider): Promise<string> {
        let publicKey: string;

        if (provider === "freighter") {
            const installed = await freighterAdapter.isInstalled();
            if (!installed) throw new Error("Freighter no está instalado. Instálalo en https://freighter.app");
            publicKey = await freighterAdapter.requestAccess();
        } else {
            const installed = await lobstrAdapter.isInstalled();
            if (!installed) throw new Error("LOBSTR no está instalado. Instálalo en https://lobstr.co/signer-extension");
            const key = await lobstrAdapter.getPublicKey();
            if (!key) throw new Error("No se pudo obtener el public key. Asegúrate de tener la app LOBSTR vinculada.");
            publicKey = key;
        }

        localStorage.setItem(STORAGE_KEY, provider);
        return publicKey;
    },

    clearSession() {
        localStorage.removeItem(STORAGE_KEY);
    },
};