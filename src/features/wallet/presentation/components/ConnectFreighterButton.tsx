"use client";

import { useWalletContext } from "../context/WalletContext";

export function ConnectFreighterButton() {
    const { isConnected, isLoading, error, connect, disconnect } = useWalletContext();

    if (isConnected) {
        return (
            <div>
                <button onClick={disconnect}>Disconnect Wallet</button>
            </div>
        );
    }

    return (
        <div>
            <button className="p-5" onClick={() => connect("freighter")} disabled={isLoading}>
                {isLoading ? "Conectando..." : "Conectar Freighter"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}