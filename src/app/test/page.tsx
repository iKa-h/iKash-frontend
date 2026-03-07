'use client'

import { useWallet } from "@/features/wallet";
import { useWalletTransactions } from "@/features/wallet/presentation/hooks/useWalletTransaction";

export default function Test() {
    const { publicKey } = useWallet();
    const { transactions, isLoading, error } = useWalletTransactions(publicKey);

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            {transactions.map((trx) => (
                <div key={trx.id} className="">
                    <p>id: {trx.id}</p>
                    <p>source account: {trx.source_account}</p>
                </div>
            ))}
        </div>
    );
}