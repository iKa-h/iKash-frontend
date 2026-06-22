import {
    isConnected,
    isAllowed,
    requestAccess,
    getAddress,
    signTransaction,
} from "@stellar/freighter-api";

export const freighterAdapter = {
    // Verifica si Freighter ya está instalado
    async isInstalled(): Promise<boolean> {
        try {
            const res = await isConnected();
            return res.isConnected ?? false;
        } catch {
            return false;
        }
    },

    // Verifica si ya tiene permisos previamente
    async isAllowed(): Promise<boolean> {
        try {
            const res = await isAllowed();
            return res.isAllowed ?? false;
        } catch {
            return false;
        }
    },

    // Se solicita acceso al usuario
    // Retorna la publicKey
    async requestAccess(): Promise<string> {
        const res = await requestAccess();
        if (res.error) throw new Error(res.error);
        return res.address;
    },

    // Obtiene el publicKey si ya está conectado
    async getAddress(): Promise<string | null> {
        try {
            const res = await getAddress();
            if (res.error || !res.address) return null;
            return res.address;
        } catch {
            return null;
        }
    },

    // Firma una transacción XDR con Freighter
    async signTransaction(xdr: string, network: string = "TESTNET"): Promise<string> {
        const res: any = await signTransaction(xdr, {
            networkPassphrase:
                network.toUpperCase() === "PUBLIC"
                    ? "Public Global Stellar Network ; September 2015"
                    : "Test SDF Network ; September 2015",
        });
        // Freighter v6 returns { code: -4, message: "The user rejected this request." }
        // when the user cancels. Throw the raw error so callers can inspect code/message fields.
        if (res?.error) throw res.error;
        return typeof res === "string"
            ? res
            : res.signedTxXdr || res.signedTransaction || res.signedXDR || res;
    }
};