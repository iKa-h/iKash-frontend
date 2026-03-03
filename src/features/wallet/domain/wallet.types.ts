export interface WalletState {
    publicKey: string | null;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface WalletActions {
    connect: () => Promise<void>;
    disconnect: () => void;
}

export type WalletContext = WalletState & WalletActions;