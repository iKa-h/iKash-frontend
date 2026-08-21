export type StellarNetwork = 'testnet' | 'mainnet';
export type DetectedStellarNetwork = 'testnet' | 'mainnet' | 'unknown';

export interface WalletNetworkState {
    expectedNetwork: StellarNetwork;
    currentNetwork: DetectedStellarNetwork;
    isCorrectNetwork: boolean;
    isCheckingNetwork: boolean;
    error: string | null;
}
