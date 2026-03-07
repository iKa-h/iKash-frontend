"use client";

import { useState } from "react";
import { useWallet } from "@/features/wallet";
import { useWalletPay } from "@/features/wallet/presentation/hooks/useWalletPay";

export default function Test() {
    const { publicKey } = useWallet();
    const { isLoading, error, success, sendPayment } = useWalletPay(publicKey);

    const [destination, setDestination] = useState("");
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await sendPayment({ destination, amount, memo });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Destino"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Monto"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
            />

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>¡Pago enviado!</p>}
        </form>
    );
}