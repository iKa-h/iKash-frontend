// ─── Escrow Status ───────────────────────────────────────────────────────

export type EscrowStatus =
  | "pending"
  | "initialized"
  | "funded"
  | "fiat_sent"
  | "released"
  | "disputed"
  | "resolved";

export type EscrowAction = "initialize" | "fund" | "release";

// ─── API Request Payloads ────────────────────────────────────────────────

export interface InitializeEscrowPayload {
  orderId: string;
  signerAddress: string;
  sellerAddress: string;
  buyerAddress: string;
  amount: number;
  title: string;
}

export interface FundEscrowPayload {
  escrowId: string;
  signerAddress: string;
  amount: number;
}

export interface ReleaseEscrowPayload {
  escrowId: string;
  releaseSigner: string;
}

export interface SyncEscrowPayload {
  escrowId: string;
  signedXdr: string;
  action: EscrowAction;
}

// ─── API Response Types ──────────────────────────────────────────────────

export interface UnsignedTransactionResponse {
  escrowId: string;
  unsignedTransaction: string;
}

export interface SyncTransactionResponse {
  escrowId: string;
  status: string;
  contractId?: string;
  newEscrowStatus: EscrowStatus;
}

export interface EscrowRecord {
  escrowId: string;
  orderId: string;
  contractId: string | null;
  escrowStatus: EscrowStatus;
  amount: string | null;
  buyerAddress: string | null;
  sellerAddress: string | null;
  txHashLock: string | null;
  txHashRelease: string | null;
  onChainBalance: any | null;
  onChainData: any | null;
}

// ─── Hook State ──────────────────────────────────────────────────────────

export interface EscrowOperationState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}
