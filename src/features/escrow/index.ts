// ─── Escrow Feature — Public API ─────────────────────────────────────────

// Context
export { EscrowProvider, useEscrowContext } from "./presentation/context/EscrowContext";

// Hooks
export { useInitializeEscrow } from "./presentation/hooks/useInitializeEscrow";
export { useFundEscrow } from "./presentation/hooks/useFundEscrow";
export { useReleaseEscrow } from "./presentation/hooks/useReleaseEscrow";
export { useEscrowStatus } from "./presentation/hooks/useEscrowStatus";

// Infrastructure
export { signTransaction } from "./infrastructure/stellar-wallet-kit.config";

// Types
export type {
  EscrowStatus,
  EscrowAction,
  EscrowRecord,
  InitializeEscrowPayload,
  FundEscrowPayload,
  ReleaseEscrowPayload,
  SyncEscrowPayload,
  EscrowOperationState,
} from "./domain/escrow.types";
