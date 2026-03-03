import { isConnected, getPublicKey } from "@lobstrco/signer-extension-api";

export const lobstrAdapter = {
    //Verifica si el usuario tiene la extensión LOBSTR instalada.
    async isInstalled(): Promise<boolean> {
        try {
            return await isConnected();
        } catch {
            return false;
        }
    },

    //Obtiene el public key del usuario.
    async getPublicKey(): Promise<string | null> {
        try {
            const key = await getPublicKey();
            return key || null;
        } catch {
            return null;
        }
    },
};