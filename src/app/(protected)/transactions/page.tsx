"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useOrders } from "@/features/order/hooks/useOrders";
import { useRouter } from "next/navigation";
import { Aside } from "../../components/Aside";

export default function TransactionsPage() {
    const { currentUser } = useUser();
    const { orders, fetchUserOrders } = useOrders();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!currentUser?.userId) return;
        setLoading(true);
        fetchUserOrders(currentUser.userId).finally(() => setLoading(false));
    }, [currentUser?.userId]);

    return (
        <div className="flex min-h-screen w-full bg-[#010308]">
            <Aside />
            <div className="p-4 md:p-6 max-w-4xl mx-auto pb-20 md:pb-0">
                <h1 className="text-2xl font-bold mb-4 text-white">Transactions</h1>

                {loading && <p className="text-white">Loading orders...</p>}

                {!loading && orders.length === 0 && (
                    <div className="bg-gray-800 p-4 rounded">
                        <p className="text-white">No orders found.</p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {orders.map(o => (
                        <div
                            key={o.orderId}
                            onClick={() => router.push("/p2p/orders/" + o.orderId.replace(/-/g, ""))}
                            className="bg-[#0E0E13] border border-[#2A2A2A] rounded-lg p-4 cursor-pointer hover:border-[#DAFF00] hover:bg-[#15151b] transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-lg font-semibold text-white">Order {o.orderId}</div>
                                    <div className="text-sm text-gray-400">Status: {o.orderStatus}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-white">Asset: {o.assetAmount}</div>
                                    <div className="text-sm text-white">Fiat: {o.fiatAmount}</div>
                                </div>
                            </div>
                            {o.escrow && (
                                <div className="mt-3 text-sm text-gray-300">
                                    Escrow: {o.escrow.escrowId} — {o.escrow.escrowStatus}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
