import { freighterAdapter } from "../infrastructure/freighter.adapter";

export const walletService = {
    // Intenta recuperar la sesión previa
    async restoreSession(): Promise<string | null> {
        const installed = await freighterAdapter.isInstalled();
        if (!installed) return null;

        const allowed = await freighterAdapter.isAllowed();
        if (!allowed) return null;

        return freighterAdapter.getAddress();
    },

    // Conecta la wallet
    async connect(): Promise<string> {
        const installed = await freighterAdapter.isInstalled();
        if (!installed) {
            throw new Error(
                "Please install Freighter"
            );
        }

        return freighterAdapter.requestAccess();
    },
};