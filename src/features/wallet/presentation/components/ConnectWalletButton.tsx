"use client";

import { useWalletContext } from "../context/WalletContext";

export function ConnectWalletButton() {
  const { publicKey, provider, isConnected, isLoading, error, connect, disconnect } =
    useWalletContext();

  const shortKey = publicKey
    ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`
    : null;

  if (isConnected) {
    return (
      <div>
        <p>{provider === "freighter" ? "Freighter" : "LOBSTR"} — {shortKey}</p>
        <button onClick={disconnect}>Desconectar</button>
      </div>
    );
  }

  return (
    <div>
      <button className="p-5" onClick={() => connect("freighter")} disabled={isLoading}>
        {isLoading ? "Conectando..." : "Conectar Freighter"}
      </button>
      <button className="p-5" onClick={() => connect("lobstr")} disabled={isLoading}>
        {isLoading ? "Conectando..." : "Conectar LOBSTR"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}