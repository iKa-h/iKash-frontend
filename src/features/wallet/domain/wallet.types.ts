export type WalletStatus =
    | "AVAILABLE"
    | "NOT_INSTALLED"
    | "UNAVAILABLE"
    | "CONNECTING"
    | "CONNECTED"
    | "ERROR";

export interface WalletState {
    publicKey: string | null;
    walletId: string | null;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface WalletActions {
    connect: (walletId: string) => Promise<void>;
    disconnect: () => void;
    signTransaction: (xdr: string, network?: string) => Promise<string>;
}

export type WalletContext = WalletState & WalletActions;

// Normalized shape suggested by IKSH-20 for consumers that need the full
// connection picture without touching the kit's internal API.
export interface ConnectedWalletState {
    walletId: string | null;
    walletName: string | null;
    address: string | null;
    isConnected: boolean;
    isConnecting: boolean;
    network: "testnet";
    error: string | null;
}
