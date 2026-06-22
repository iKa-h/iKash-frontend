import { freighterAdapter } from "../infrastructure/freighter.adapter";
import { lobstrAdapter } from "../infrastructure/lobstr.adapter";
import type { WalletProvider } from "../domain/wallet.types";

// recupera la ultima wallet usada
const PROVIDER_KEY = "wallet:provider";
const PUBLICKEY_KEY = "wallet:publicKey";

export const walletService = {
    //Restaura la sesión desde localStorage sin llamadas a las extensiones
    async restoreSession(): Promise<{ publicKey: string; provider: WalletProvider } | null> {
        const savedProvider = localStorage.getItem(PROVIDER_KEY) as WalletProvider | null;
        const savedPublicKey = localStorage.getItem(PUBLICKEY_KEY);

        // Si no hay datos guardados, no hay sesión que restaurar
        if (!savedProvider || !savedPublicKey) return null;

        // Validar que el proveedor esté instalado (sin pedir autorización)
        if (savedProvider === "freighter") {
            const installed = await freighterAdapter.isInstalled();
            if (!installed) {
                // Limpiar si la extensión no está instalada
                this.clearSession();
                return null;
            }
            return { publicKey: savedPublicKey, provider: "freighter" };
        }

        if (savedProvider === "lobstr") {
            const installed = await lobstrAdapter.isInstalled();
            if (!installed) {
                // Limpiar si la extensión no está instalada
                this.clearSession();
                return null;
            }
            return { publicKey: savedPublicKey, provider: "lobstr" };
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

        // Guardar tanto el provider como el publicKey
        localStorage.setItem(PROVIDER_KEY, provider);
        localStorage.setItem(PUBLICKEY_KEY, publicKey);
        return publicKey;
    },

    async signTransaction(xdr: string, network = "TESTNET"): Promise<string> {
        const provider = localStorage.getItem(PROVIDER_KEY) as WalletProvider | null;
        if (!provider) throw new Error("No wallet connected");

        if (provider === "freighter") {
            return await freighterAdapter.signTransaction(xdr, network);
        } else {
            return await lobstrAdapter.signTransaction(xdr);
        }
    },

    clearSession() {
        localStorage.removeItem(PROVIDER_KEY);
        localStorage.removeItem(PUBLICKEY_KEY);
    },
};

export function isSignatureCancelled(error: unknown): boolean {
    if (typeof error === "object" && error !== null) {
        const err = error as Record<string, unknown>;

        // Primary detection: Freighter returns { code: -4, message: "The user rejected this request." }
        if (err.code === -4) return true;

        // Fallback: message-based matching for wallets without a reliable numeric code
        // (e.g. LobSTR, or older SDK versions). This is a known limitation — text matching
        // is fragile but necessary where no structured signal is available.
        const msg = err.message;
        if (typeof msg === "string") {
            const lower = msg.toLowerCase();
            if (lower.includes("cancel") || lower.includes("reject") || lower.includes("declined")) {
                return true;
            }
        }
    }

    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        return msg.includes("cancel") || msg.includes("reject") || msg.includes("declined");
    }

    return false;
}