"use client";

import { useState, useCallback } from "react";
import { escrowService } from "../../application/escrow.service";
import { signTransaction } from "../../infrastructure/stellar-wallet-kit.config";
import { useWallet } from "../../../wallet";
import type {
  EscrowOperationState,
  SyncTransactionResponse,
} from "../../domain/escrow.types";

/**
 * useFundEscrow
 *
 * Orchestrates the full 3-step escrow funding:
 * 1. Request unsigned XDR from backend
 * 2. Sign it with the seller's wallet
 * 3. Send the signed XDR back for broadcast
 *
 * @param walletAddress - The connected seller's Stellar public key
 */
export function useFundEscrow(walletAddress: string | null) {
  const { provider } = useWallet();
  const [state, setState] = useState<EscrowOperationState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const fundEscrow = useCallback(
    async (
      escrowId: string,
      amount: number
    ): Promise<SyncTransactionResponse | null> => {
      if (!walletAddress) {
        setState((s) => ({ ...s, error: "Wallet not connected" }));
        return null;
      }

      setState({ isLoading: true, error: null, success: false });

      try {
        // STEP 1: Get unsigned XDR from backend
        const { unsignedTransaction } = await escrowService.fund({
          escrowId,
          signerAddress: walletAddress,
          amount,
        });

        if (!provider) throw new Error("Wallet provider not connected");

        // STEP 2: Sign with wallet
        const signedXdr = await signTransaction({
          unsignedTransaction,
          address: walletAddress,
          provider,
        });

        // STEP 3: Broadcast via backend
        const result = await escrowService.sync({
          escrowId,
          signedXdr,
          action: "fund",
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

  return { ...state, fundEscrow };
}
