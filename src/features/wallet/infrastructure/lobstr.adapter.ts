import { isConnected, getPublicKey, signTransaction as lobstrSignTransaction } from "@lobstrco/signer-extension-api";

export const lobstrAdapter = {
    //Verifica si el usuario tiene la extensión LOBSTR instalada.
    async isInstalled(): Promise<boolean> {
        try {
            return await isConnected();
        } catch {
            return false;
        }
    },

    // Obtiene el public key del usuario.
    async getPublicKey(): Promise<string | null> {
        try {
            const key = await getPublicKey();
            return key || null;
        } catch {
            return null;
        }
    },

    // Firma una transacción XDR con LOBSTR
    async signTransaction(xdr: string): Promise<string> {
        const res: any = await lobstrSignTransaction(xdr);
        if (res?.error) {
            // Preserve structured error (if object) so isSignatureCancelled can inspect fields;
            // fall back to string wrapping for plain string errors.
            throw typeof res.error === "string" ? new Error(res.error) : res.error;
        }
        return typeof res === "string"
            ? res
            : res.signedTxXdr || res.signedTransaction || res.signedXDR || res;
    },
};