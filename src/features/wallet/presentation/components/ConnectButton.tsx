"use client";

import { WalletProvider } from "../../domain/wallet.types";
import { useWalletContext } from "../context/WalletContext";
import { WalletButtonProps } from "../utils/WalletButtonProps";

export function ConnectButton({ label, description, connection }: WalletButtonProps) {
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
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors duration-100 cursor-pointer"
                onClick={() => connect(connection as WalletProvider)} disabled={isLoading}
            >

                <div className="text-left">
                    <span>
                        {isLoading ? "Connecting..." : <p className="text-white text-[18px] font-medium">{label}</p>}
                    </span>
                    <p className="text-gray-500 text-xs">{description}</p>
                </div>

            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

    );
}