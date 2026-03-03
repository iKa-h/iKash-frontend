export type WalletProvider = "freighter" | "lobstr";

export interface WalletState {
    publicKey: string | null;
    provider: WalletProvider | null;
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface WalletActions {
    connect: (provider: WalletProvider) => Promise<void>;
    disconnect: () => void;
}

export type WalletContext = WalletState & WalletActions;