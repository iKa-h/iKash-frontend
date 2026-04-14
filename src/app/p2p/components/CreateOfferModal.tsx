'use client';

import Image from 'next/image'

import paymentMethods from "../utils/paymentMethods";
import arrow from '../../../../public/down-arrow.svg'
import { useState } from 'react';
import cryptoAssets from '../utils/cryptoAssets';
import { CreateOfferModalProps } from '../utils/createOfferModalProps';

export function CreateOfferModal({ onClose }: CreateOfferModalProps) {
    const [isCryptoAssetOpen, setIsCryptoAssetOpen] = useState(false);
    const [cryptoAsset, setCryptoAsset] = useState(cryptoAssets[0]);
    const [tab, setTab] = useState("Buy");

    const [checked, setChecked] = useState<number[]>([]);
    const toggle = (id: number) => {
        setChecked(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

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
                    <h2 className="text-white text-lg font-semibold">Create New Offer</h2>
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
                    <div>
                        <p className="text-[#64748B]">Offer type</p>
                        <div className="flex flex-col h-full items-center justify-center mb-6">
                            <div className="grid grid-cols-2 bg-[#05050980] w-full rounded-lg p-1">
                                {["Buy", "Sell"].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTab(t)}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200
                                    ${tab === t
                                                ? "bg-[#BCED09] text-[#050509]"
                                                : "text-[#94A3B8] hover:text-white"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-[#CBD5E1]">Select Crypto Asset</p>
                        <div className="relative mt-3">

                            <div
                                className="relative bg-[#0D1117] border border-[#1C2128] rounded-xl px-5 py-4 cursor-pointer"
                                onClick={() => setIsCryptoAssetOpen(!isCryptoAssetOpen)}
                            >
                                <span className="text-[#F1F5F9] text-[16px]">{cryptoAsset}</span>
                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Image src={arrow} width={24} height={24} alt="flecha del select" />
                                </div>
                            </div>
                            {isCryptoAssetOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-[#1a1d27] rounded-xl overflow-hidden border border-white/10">
                                    {cryptoAssets.map((c) => (
                                        <div
                                            key={c}
                                            onClick={() => {
                                                setCryptoAsset(c);
                                                setIsCryptoAssetOpen(false);
                                            }}
                                            className={`px-5 py-3 text-[16px] cursor-pointer hover:bg-white/10 transition-colors
                                            ${cryptoAsset === c ? 'text-[#BCED09]' : 'text-[#F1F5F9]'}`}
                                        >
                                            {c}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='mt-3'>
                        <p className="text-[#CBD5E1]">Price per Unit</p>
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
                                    USD
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-3 mt-3'>
                        <div>
                            <p className="text-[#CBD5E1]">Min Amount</p>
                            <div className="relative mt-3">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    min={0}
                                    onKeyDown={(e) => ["-", "e", "E"].includes(e.key) && e.preventDefault()}
                                    className="bg-[#0D1117] w-full border border-[#1C2128] rounded-xl px-5 
                                            py-4 text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none 
                                            focus:ring-2 focus:ring-[#BCED09] [appearance:textfield]
                                            [&::-webkit-outer-spin-button]:appearance-none
                                            [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>
                        <div>
                            <p className="text-[#CBD5E1]">Max Amount</p>
                            <div className="relative mt-3">
                                <input
                                    type="number"
                                    placeholder="Max"
                                    min={0}
                                    onKeyDown={(e) => ["-", "e", "E"].includes(e.key) && e.preventDefault()}
                                    className="bg-[#0D1117] w-full border border-[#1C2128] rounded-xl px-5 
                                            py-4 text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none 
                                            focus:ring-2 focus:ring-[#BCED09] [appearance:textfield]
                                            [&::-webkit-outer-spin-button]:appearance-none
                                            [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <p className="text-[#CBD5E1]">Payment Methods</p>
                        <div className="flex flex-col gap-4">
                            {paymentMethods.map((option) => (
                                <div
                                    key={option.id}
                                    className={`flex w-99.75 h-17.5 border rounded-xl items-center gap-3 cursor-pointer
                                                ${checked.includes(option.id) ? 'border-[#DAFF0066]' : 'border-[#1C2128]'}`}
                                    onClick={() => toggle(option.id)}
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors m-3
                                                ${checked.includes(option.id) ? 'bg-[#DAFF00] border-[#DAFF00]' : 'bg-transparent border-gray-600'}`}
                                    >
                                        {checked.includes(option.id) && (
                                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="black" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className="text-[#F1F5F9] text-sm select-none">{option.label}</span>
                                        <span className="text-[#F1F5F9] text-sm select-none">{option.info}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex w-full items-center justify-center gap-3 mt-10">
                        <button
                            onClick={() => onClose()}
                            className="flex-1 bg-[#BCED09] text-black font-semibold px-4 py-3 rounded-xl hover:bg-[#9ac208] transition-colors"
                        >
                            Publish Offer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}