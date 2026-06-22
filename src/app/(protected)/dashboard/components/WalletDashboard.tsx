"use client"

import Image from "next/image";
import { useWallet } from "@/features/wallet";
import { useWalletBalance } from "@/features/wallet/presentation/hooks/useWalletBalance";
import { useState } from "react";
import { SendFundsModal } from "./SendFundsModal";
import { ReceiveFundsModal } from "./ReceiveFundsModal";

export function WalletDashboard() {
    const { publicKey } = useWallet();
    const { balance, balances, isLoading, error } = useWalletBalance(publicKey);

    const [isSendModalOpen, setIsModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

    return (
        <div className="w-full flex flex-col pt-6 px-4 pb-24 md:pt-12 md:pr-8 md:pb-12 md:pl-0 md:border-r md:border-[#1F2937] md:max-w-284">
            <div
                className="relative rounded-2xl overflow-hidden p-5 md:p-8 w-full mb-8 shadow-lg"
                style={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #1f2a1a 60%, #2a3a1a 100%)",
                    boxShadow: "0 0 60px rgba(188,237,9,0.08)",
                }}
            >
                <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
                    style={{
                        background: "radial-gradient(circle, #bced09 0%, transparent 70%)",
                        transform: "translate(30%, -30%)",
                    }}
                />

                <p className="text-[14px] tracking-[1.4px] text-[#8F8389] uppercase">
                    Total Balance
                </p>

                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-[40px] md:text-[72px] font-bold text-white tracking-tight">
                                {isLoading ? "..." : error ? "-" : (balance || "0.00")}
                            </span>
                            <span className="text-[#8F8389] text-[18px] md:text-[24px] tracking-[-3.6px]">XLM</span>
                        </div>
                        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col mb-8">
                <div className="flex justify-between items-center mb-4 px-1">
                    <span className="text-white font-bold text-base tracking-wide">Assets</span>
                </div>

                <div className="space-y-2">
                    {isLoading ? (
                        <p className="text-[#8F8389] text-sm p-4">Loading assets...</p>
                    ) : balances.length === 0 ? (
                        <p className="text-[#8F8389] text-sm p-4">No assets found</p>
                    ) : (
                        balances.map((asset, index) => {
                            const symbol = asset.asset_type === "native" ? "XLM" : asset.asset_code || "UNKNOWN";
                            const name = asset.asset_type === "native" ? "STELLAR LUMENS" : symbol;
                            const amount = parseFloat(asset.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 });

                            return (
                                <div
                                    key={`${symbol}-${index}`}
                                    className="flex items-center justify-between p-4 rounded-xl bg-[#161618] border border-[#1f1f1f] hover:border-[#2a2a2a] hover:bg-[#181818] transition-all duration-200 cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#1a2a3a] flex items-center justify-center border border-[#2a2a2a] text-white font-bold text-xs overflow-hidden shrink-0">
                                            {symbol === "XLM" ? (
                                                <Image src="/xlm.png" alt="XLM" width={40} height={40} className="w-full h-full object-cover" />
                                            ) : symbol === "USDC" ? (
                                                <Image src="/usdc.png" alt="USDC" width={40} height={40} className="w-full h-full object-cover" />
                                            ) : (
                                                symbol.slice(0, 3)
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm tracking-wide">{symbol}</p>
                                            <p className="text-[#4b5563] text-[10px] tracking-[0.15em] uppercase">{name}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-white font-bold text-sm tabular-nums">{amount}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {isSendModalOpen && <SendFundsModal onClose={() => setIsModalOpen(false)} />}
            {isReceiveModalOpen && <ReceiveFundsModal onClose={() => setIsReceiveModalOpen(false)} />}
        </div>
    );
}