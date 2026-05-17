"use client"

import Image from "next/image";
import { useWallet } from "@/features/wallet";
import { useWalletBalance } from "@/features/wallet/presentation/hooks/useWalletBalance";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SendFundsModal } from "./SendFundsModal";
import { ReceiveFundsModal } from "./ReceiveFundsModal";

export function WalletDashboard() {
    const { publicKey } = useWallet();
    const { balance, balances, isLoading, error } = useWalletBalance(publicKey);

    const [isSendModalOpen, setIsModalOpen] = useState(false);
    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

    // Esto es de prueba, hay que quitarlo
    const nav = useRouter();

    return (
        <div className="w-full max-w-[1136px] min-h-[calc(100vh-100px)] flex flex-col pt-12 pr-8 pb-12 border-r border-[#1F2937]">
            <div
                className="relative rounded-2xl overflow-hidden p-8 w-full mb-8 shadow-lg"
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
                            <span className="text-[72px] font-bold text-white tracking-tight">
                                {isLoading ? "..." : error ? "-" : (balance || "0.00")}
                            </span>
                            <span className="text-[#8F8389] text-[24px] tracking-[-3.6px]">XLM</span>
                        </div>
                        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                    </div>

                    <div className="flex gap-3">
                        <button 
                            className="flex items-center gap-2 bg-[#bced09] hover:bg-[#d4f53a] text-black text-xs font-bold 
                            px-5 py-3 rounded-xl tracking-wider transition-all duration-200 hover:scale-105 active:scale-95"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none">
                                <path d="M2 12L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            SEND
                        </button>
                        <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-bold 
                            px-5 py-3 rounded-xl tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 border border-[#3a3a3a]"
                            onClick={() => setIsReceiveModalOpen(true)}
                        >
                            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none">
                                <path d="M12 2L2 12M2 12H9M2 12V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            RECEIVE
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col mb-8">
                <div className="flex justify-between items-center mb-4 px-1">
                    <span className="text-white font-bold text-base tracking-wide">Assets</span>
                    <button className="text-[#bced09] text-xs tracking-wider hover:text-[#d4f53a] transition-colors">
                        View all →
                    </button>
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
            {isReceiveModalOpen && <ReceiveFundsModal onClose={() => setIsReceiveModalOpen(false)} /> }

            <div className="pt-12">
                <button onClick={() => nav.push('/test')} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Test</button>
            </div>
        </div>
    );
}