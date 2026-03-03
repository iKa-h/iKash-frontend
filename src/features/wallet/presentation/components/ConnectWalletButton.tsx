"use client";

import { useWallet } from "../hooks/useWallet";

export function ConnectWalletButton() {
    const { publicKey, isConnected, isLoading, error, connect, disconnect } = useWallet();

    const shortKey = publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : null;

    return (
        <div>
            {isConnected ? (
                <button onClick={disconnect}>
                    {shortKey} - Disconnect
                </button>
            ) : (
                <button onClick={connect} disabled={isLoading}>
                    {isLoading ? "Connecting..." : "Connect Freighter"}
                </button>
            )}
            {error && <p className="color: bg-red-500">{error}</p>}
        </div>
    );
}