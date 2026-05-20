import { useCallback } from "react";
import { useUser } from "../../user/presentation/context/UserContext";

export interface OpenEscrowParams {
    orderId: string;
    sellerAddress: string;
    buyerAddress: string;
    amount: number;
    title: string;
    assetCode?: string;
}

export interface FundEscrowParams {
    escrowId: string;
    signerAddress: string;
    amount: number;
}

export interface SyncEscrowParams {
    escrowId: string;
    action: "initialize" | "fund" | "fiat_sent" | "release";
    signedXdr: string;
}

export interface FiatSentParams {
    buyerAddress: string;
    evidence?: string;
}

export interface ReleaseEscrowParams {
    escrowId: string;
    releaseSigner: string;
}

export function useEscrows() {
    const { accessToken, logout } = useUser();

    const handleResponse = async (res: Response, defaultMsg: string) => {
        if (res.status === 401) {
            logout();
            throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.message ? (Array.isArray(errData.message) ? errData.message.join(', ') : errData.message) : defaultMsg;
            throw new Error(msg);
        }
        return res.json();
    };

    const openEscrow = useCallback(async (params: OpenEscrowParams) => {
        const headers: Record<string, string> = { "Content-type": "application/json" };
        if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/escrows/open`, {
            method: "POST",
            headers,
            body: JSON.stringify(params),
        });
        return await handleResponse(res, "Error al abrir el contrato de escrow");
    }, [accessToken]);

    const fundEscrow = useCallback(async (params: FundEscrowParams) => {
        const headers: Record<string, string> = { "Content-type": "application/json" };
        if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/escrows/fund`, {
            method: "POST",
            headers,
            body: JSON.stringify(params),
        });
        return await handleResponse(res, "Error al preparar la transacción de fondeo");
    }, [accessToken]);

    const syncEscrow = useCallback(async (params: SyncEscrowParams) => {
        const headers: Record<string, string> = { "Content-type": "application/json" };
        if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/escrows/sync`, {
            method: "POST",
            headers,
            body: JSON.stringify(params),
        });
        return await handleResponse(res, "Error al sincronizar la transacción en blockchain");
    }, [accessToken]);

    const markFiatSent = useCallback(async (escrowId: string, params: FiatSentParams) => {
        const headers: Record<string, string> = { "Content-type": "application/json" };
        if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/escrows/${escrowId}/fiat-sent`, {
            method: "POST",
            headers,
            body: JSON.stringify(params),
        });
        return await handleResponse(res, "Error al confirmar el envío de pago");
    }, [accessToken]);

    const releaseEscrow = useCallback(async (params: ReleaseEscrowParams) => {
        const headers: Record<string, string> = { "Content-type": "application/json" };
        if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/escrows/release`, {
            method: "POST",
            headers,
            body: JSON.stringify(params),
        });
        return await handleResponse(res, "Error al liberar los fondos del escrow");
    }, [accessToken]);

    return { openEscrow, fundEscrow, syncEscrow, markFiatSent, releaseEscrow };
}
