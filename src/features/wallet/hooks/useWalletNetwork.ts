import { useWalletContext } from "../presentation/context/WalletContext";
import type { WalletNetworkState } from "../types/wallet-network.types";

export function useWalletNetwork(): WalletNetworkState & { checkNetwork: () => Promise<void> } {
    const {
        expectedNetwork,
        currentNetwork,
        isCorrectNetwork,
        isCheckingNetwork,
        error,
        checkNetwork,
    } = useWalletContext();

    return {
        expectedNetwork,
        currentNetwork,
        isCorrectNetwork,
        isCheckingNetwork,
        error,
        checkNetwork: async () => {
            await checkNetwork();
        },
    };
}
