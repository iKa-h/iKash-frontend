import type {
  InitializeEscrowPayload,
  FundEscrowPayload,
  ReleaseEscrowPayload,
  SyncEscrowPayload,
  UnsignedTransactionResponse,
  SyncTransactionResponse,
  EscrowRecord,
} from "../domain/escrow.types";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";

/**
 * EscrowService — API client for iKash backend escrow endpoints
 *
 * All calls go to the iKash NestJS backend (NOT directly to Trustless Work).
 * The backend acts as the secure orchestrator, controlling escrow roles
 * and validating state transitions.
 */

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

export const escrowService = {
  /**
   * Get unsigned XDR for initializing a new escrow contract.
   */
  async initialize(
    payload: InitializeEscrowPayload
  ): Promise<UnsignedTransactionResponse> {
    return request<UnsignedTransactionResponse>("/escrows/initialize", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get unsigned XDR for funding an existing escrow.
   */
  async fund(
    payload: FundEscrowPayload
  ): Promise<UnsignedTransactionResponse> {
    return request<UnsignedTransactionResponse>("/escrows/fund", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get unsigned XDR for releasing escrow funds.
   */
  async release(
    payload: ReleaseEscrowPayload
  ): Promise<UnsignedTransactionResponse> {
    return request<UnsignedTransactionResponse>("/escrows/release", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Submit a signed XDR to the backend for broadcast.
   */
  async sync(
    payload: SyncEscrowPayload
  ): Promise<SyncTransactionResponse> {
    return request<SyncTransactionResponse>("/escrows/sync", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Mark that the buyer has sent fiat payment.
   */
  async markFiatSent(escrowId: string): Promise<EscrowRecord> {
    return request<EscrowRecord>(`/escrows/${escrowId}/fiat-sent`, {
      method: "POST",
    });
  },

  /**
   * Get escrow status with live on-chain balance data.
   */
  async getStatus(escrowId: string): Promise<EscrowRecord> {
    return request<EscrowRecord>(`/escrows/${escrowId}/status`);
  },
};
