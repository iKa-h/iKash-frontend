'use client';

import Image from 'next/image'

import { CloseModalProps } from "@/app/utils/closeModalProps";
import arrow from '../../../../public/down-arrow.svg'
import { useState, useEffect } from "react";
import { useWallet, useWalletBalance, type AssetBalance } from "@/features/wallet";

export function SendFundsModal({ onClose }: CloseModalProps) {
    const { publicKey } = useWallet();
    const { balances } = useWalletBalance(publicKey);

    const defaultAsset: AssetBalance = {
        asset_type: "native",
        asset_code: "XLM",
        asset_issuer: null,
        balance: "0.00"
    };

    const currentBalances = balances.length > 0 ? balances : [defaultAsset];
    const [asset, setAsset] = useState<AssetBalance>(currentBalances[0]);
    const [isAssetOpen, setIsAssetOpen] = useState(false);

    useEffect(() => {
        if (balances.length > 0) {
            setAsset(balances[0]);
        }
    }, [balances]);

    const getAssetName = (a: AssetBalance) => a.asset_type === "native" ? "XLM" : (a.asset_code || "UNKNOWN");
    const getFormattedBalance = (a: AssetBalance) => parseFloat(a.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 });

    return (
        <div
            className="fixed inset-0 bg-[black/60] backdrop-blur-sm z-40 flex items-center justify-end"
            onClick={() => onClose()}
        >
            <div
                className="bg-[#0D1117F2] h-full w-md p-8 border-r border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <h2 className="text-white text-[30px] font-bold uppercase">Send Funds</h2>
                        <p className="text-[#C2C7D0] text-[14px]">Instant cross-border crypto transfers.</p>
                    </div>
                    <button
                        onClick={() => onClose()}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="w-full h-px mb-6" style={{ background: 'linear-gradient(to right, #BCED0900, #BCED09, #BCED0900)' }} />

                <div className="w-99.75 h-12">
                    <div className="flex flex-col">
                        <p className="text-[#C2C7D0] text-[12px] mb-2 uppercase">Recipient Address or Alias</p>
                        <input type="text" placeholder="alex.ikash"
                            className="w-87.5 h-13 rounded-sm border border-[#45493233] bg-[#1B1B21] pl-3 text-white"
                        />
                        <span className="text-[#C2C7D099] text-[10px] mt-2">Verified iKa$h names are cheaper to send to.</span>
                    </div>
                    <div className='mt-3'>
                        <p className="text-[#C2C7D0] text-[12px] mb-2 uppercase">Select asset</p>
                        <div className="relative mt-3">

                            <div
                                className="relative bg-[#0D1117] border border-[#1C2128] rounded-xl px-5 py-4 cursor-pointer"
                                onClick={() => setIsAssetOpen(!isAssetOpen)}
                            >
                                <div className='flex flex-col'>
                                    <span className="text-[#FFFFFF] text-[14px] font-bold">{getAssetName(asset)}</span>
                                    <span className='text-[10px] text-[#C2C7D0] uppercase'>Balance: {getFormattedBalance(asset)}</span>
                                </div>
                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Image src={arrow} width={24} height={24} alt="flecha del select" />
                                </div>
                            </div>
                            {isAssetOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-[#1a1d27] rounded-xl overflow-hidden border border-white/10">
                                    {currentBalances.map((c, idx) => (
                                        <div
                                            key={`${getAssetName(c)}-${idx}`}
                                            onClick={() => {
                                                setAsset(c);
                                                setIsAssetOpen(false);
                                            }}
                                            className={`px-5 py-3 text-[14px] font-bold cursor-pointer hover:bg-white/10 transition-colors
                                            ${asset === c ? 'text-[#BCED09]' : 'text-[#FFFFFF]'}`}
                                        >
                                            <div className='flex flex-col'>
                                                <span>{getAssetName(c)}</span>
                                                <span className={`text-[10px] uppercase 
                                                    ${asset === c ? 'text-[#BCED09]' : 'text-[#C2C7D0]'}`}>
                                                    Balance: {getFormattedBalance(c)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='mt-3'>
                            <p className="text-[#C2C7D0] text-[12px] mb-2 uppercase">amount to send</p>
                            <div className="relative mt-3">
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    min={0}
                                    onKeyDown={(e) => ["-", "e", "E"].includes(e.key) && e.preventDefault()}
                                    className="bg-[#0D1117] w-full border border-[#1C2128] rounded-xl px-5 
                                        py-4 text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none 
                                        focus:ring-2 focus:ring-[#BCED09] [appearance:textfield]
                                        [&::-webkit-outer-spin-button]:appearance-none
                                        [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                                    <span className="text-[14px] text-[#94A3B8] font-bold select-none">
                                        {getAssetName(asset)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-center gap-3 mt-10">
                            <button
                                onClick={() => onClose()}
                                className="flex-1 bg-[#BCED09] uppercase text-black font-semibold px-4 py-3 rounded-xl hover:bg-[#9ac208] transition-colors"
                            >
                                review & send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}