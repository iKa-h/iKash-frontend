export type StellarNetwork = 'testnet' | 'mainnet' | 'unknown';

export type WalletNetworkState = {
  expectedNetwork: 'testnet' | 'mainnet';
  currentNetwork: StellarNetwork;
  isCorrectNetwork: boolean;
  isCheckingNetwork: boolean;
};
