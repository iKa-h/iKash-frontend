"use client";

import { useState, useCallback } from "react";
import { escrowService } from "../../application/escrow.service";
import { signTransaction } from "../../infrastructure/stellar-wallet-kit.config";
import { useWallet } from "../../../wallet";
import type {
  InitializeEscrowPayload,
  EscrowOperationState,
  SyncTransactionResponse,
} from "../../domain/escrow.types";

/**
 * useInitializeEscrow
 *
 * Orchestrates the full 3-step escrow initialization:
 * 1. Request unsigned XDR from backend
 * 2. Sign it with the user's wallet (Freighter)
 * 3. Send the signed XDR back to backend for broadcast
 *
 * @param walletAddress - The connected user's Stellar public key
 */
export function useInitializeEscrow(walletAddress: string | null) {
  const { provider } = useWallet();
  const [state, setState] = useState<EscrowOperationState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const initializeEscrow = useCallback(
    async (
      payload: Omit<InitializeEscrowPayload, "signerAddress">
    ): Promise<SyncTransactionResponse | null> => {
      if (!walletAddress) {
        setState((s) => ({ ...s, error: "Wallet not connected" }));
        return null;
      }

      setState({ isLoading: true, error: null, success: false });

      try {
        // STEP 1: Get unsigned XDR from backend
        const { escrowId, unsignedTransaction } =
          await escrowService.initialize({
            ...payload,
            signerAddress: walletAddress,
          });

        if (!provider) throw new Error("Wallet provider not connected");

        // STEP 2: Sign with wallet (client-side — private key never leaves)
        const signedXdr = await signTransaction({
          unsignedTransaction,
          address: walletAddress,
          provider,
        });

        // STEP 3: Send signed XDR back to backend for broadcast
        const result = await escrowService.sync({
          escrowId,
          signedXdr,
          action: "initialize",
        });

        setState({ isLoading: false, error: null, success: true });
        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setState({ isLoading: false, error: msg, success: false });
        return null;
      }
    },
    [walletAddress]
  );

  return { ...state, initializeEscrow };
}
