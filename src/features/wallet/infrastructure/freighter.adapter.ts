import {
    isConnected,
    isAllowed,
    requestAccess,
    getAddress,
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
    }
}