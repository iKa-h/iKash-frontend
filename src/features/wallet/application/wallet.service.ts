import { StellarNetwork } from '../types/wallet-network.types';

export class WalletNetworkService {
  static getExpectedNetwork(): 'testnet' | 'mainnet' {
    const net = process.env.NEXT_PUBLIC_STELLAR_NETWORK;
    return net === 'mainnet' ? 'mainnet' : 'testnet';
  }

  static async fetchActiveNetwork(walletProvider?: any): Promise<StellarNetwork> {
    try {
      if (walletProvider && typeof walletProvider.getNetwork === 'function') {
        const network = await walletProvider.getNetwork();
        return network?.toLowerCase().includes('mainnet') ? 'mainnet' : 'testnet';
      }
      return 'testnet';
    } catch {
      return 'unknown';
    }
  }
}
