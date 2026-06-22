"use client";

import { useState, useCallback } from "react";
import { walletService, isSignatureCancelled } from "../application/wallet.service";

export interface UseSignatureCancellationReturn {
    pendingXdr: string | null;
    showModal: boolean;
    isSigning: boolean;
    sign: (xdr: string) => Promise<string>;
    retry: () => Promise<string>;
    cancel: () => void;
}

export function useSignatureCancellation(): UseSignatureCancellationReturn {
    const [pendingXdr, setPendingXdr] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isSigning, setIsSigning] = useState(false);

    const sign = useCallback(async (xdr: string): Promise<string> => {
        setIsSigning(true);
        try {
            const signedXdr = await walletService.signTransaction(xdr);
            return signedXdr;
        } catch (err) {
            if (isSignatureCancelled(err)) {
                setPendingXdr(xdr);
                setShowModal(true);
            }
            throw err;
        } finally {
            setIsSigning(false);
        }
    }, []);

    const retry = useCallback(async (): Promise<string> => {
        if (!pendingXdr) throw new Error("No pending XDR to retry");

        setIsSigning(true);
        setShowModal(false);
        try {
            // Brief delay to let the wallet extension fully settle its
            // internal state after the cancelled popup before requesting
            // a new signature popup.
            await new Promise(r => setTimeout(r, 100));
            const signedXdr = await walletService.signTransaction(pendingXdr);
            setPendingXdr(null);
            return signedXdr;
        } catch (err) {
            if (isSignatureCancelled(err)) {
                setShowModal(true);
            } else {
                setPendingXdr(null);
            }
            throw err;
        } finally {
            setIsSigning(false);
        }
    }, [pendingXdr]);

    const cancel = useCallback(() => {
        setPendingXdr(null);
        setShowModal(false);
    }, []);

    return {
        pendingXdr,
        showModal,
        isSigning,
        sign,
        retry,
        cancel,
    };
}
