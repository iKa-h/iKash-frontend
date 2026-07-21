import { useState, useEffect, useCallback } from 'react';
import { WalletNetworkState, StellarNetwork } from '../types/wallet-network.types';
import { WalletNetworkService } from '../application/wallet.service';

export const useWalletNetwork = (walletProvider: any, isConnected: boolean) => {
  const expectedNetwork = WalletNetworkService.getExpectedNetwork();
  const [networkState, setNetworkState] = useState<WalletNetworkState>({
    expectedNetwork,
    currentNetwork: 'unknown',
    isCorrectNetwork: false,
    isCheckingNetwork: true,
  });

  const verifyNetwork = useCallback(async () => {
    if (!isConnected) {
      setNetworkState({
        expectedNetwork,
        currentNetwork: 'unknown',
        isCorrectNetwork: false,
        isCheckingNetwork: false,
      });
      return;
    }

    setNetworkState(prev => ({ ...prev, isCheckingNetwork: true }));
    const currentNetwork = await WalletNetworkService.fetchActiveNetwork(walletProvider);
    const isCorrectNetwork = currentNetwork === expectedNetwork;

    setNetworkState({
      expectedNetwork,
      currentNetwork,
      isCorrectNetwork,
      isCheckingNetwork: false,
    });
  }, [walletProvider, isConnected, expectedNetwork]);

  useEffect(() => {
    verifyNetwork();
  }, [verifyNetwork]);

  return { ...networkState, verifyNetwork };
};
