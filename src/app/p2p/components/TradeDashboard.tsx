"use client";

import Image from 'next/image'

import { useState } from "react";
import cryptoAssets from "../utils/cryptoAssets";
import arrow from '../../../../public/down-arrow.svg'

const offers = [
    {
        name: "CryptoKing_99",
        orders: "1,420",
        completion: "99.5%",
        price: "64,250.00",
        available: "0.45 BTC",
        limitMin: "$500.00",
        limitMax: "$25,000.00",
    },
    {
        name: "Zenith_Exchange",
        orders: "542",
        completion: "99.1%",
        price: "64,285.40",
        available: "1.22 BTC",
        limitMin: "$100.00",
        limitMax: "$75,000.00",
    },
    {
        name: "GlobalTransact",
        orders: "3,110",
        completion: "96.8%",
        price: "64,310.00",
        available: "0.08 BTC",
        limitMin: "$50.00",
        limitMax: "$5,000.00",
    },
];

export function TradeDashboard() {
    const [tab, setTab] = useState("Buy");
    const [amount, setAmount] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isCryptoAssetOpen, setIsCryptoAssetOpen] = useState(false);
    const [cryptoAsset, setCryptoAsset] = useState(cryptoAssets[0]);

    return (
        <div className="w-308 h-246 border-r border-[#1F2937] pt-12">
            <div className="w-284 h-43.25">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex bg-[#1a1a1a] rounded-lg p-1">
                        {["Buy", "Sell"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200
                                    ${tab === t
                                        ? "bg-[#343434] text-[#BCED09]"
                                        : "text-[#6b7280] hover:text-white"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <button onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 bg-[#BCED09] text-black text-sm font-bold px-4 py-2 rounded-2xl transition-all duration-200">
                        <span className="text-sm leading-none">+</span>
                        Create Offer
                    </button>
                </div>

                <div className="flex items-center justify-between bg-[#161618] border border-[#1F2937] rounded-3xl h-24.75 px-5 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-[#8f8389] uppercase px-1 font-bold">Currency</label>
                        <div className="flex items-center justify-between bg-[#343434] rounded-2xl px-4 py-3 w-[263.5px] cursor-pointer hover:border-[#1F2937] transition-colors">
                            <span className="text-sm text-white">USD</span>
                            <span className="text-[#6b7280] text-xs">▾</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-[#8f8389] uppercase px-1 font-bold">Payment Method</label>
                        <div className="flex items-center justify-between bg-[#343434] rounded-2xl px-4 py-3 w-[263.5px] cursor-pointer hover:border-[#1F2937] transition-colors">
                            <span className="text-sm text-white">All Methods</span>
                            <span className="text-[#6b7280] text-xs">▾</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-[#8f8389] uppercase px-1 font-bold">Amount</label>
                        <div className="flex items-center justify-between bg-[#343434] rounded-2xl px-4 py-3 w-[263.5px] cursor-pointer hover:border-[#1F2937] transition-colors">
                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-transparent text-sm text-white placeholder-[#6B7280] outline-none w-full font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-[#6b7280] text-xs ml-2">USD</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-4">
                        <button className="flex items-center bg-[#343434] rounded-2xl px-4 py-3 w-[263.5px] cursor-pointer hover:border-[#1F2937] transition-colors">
                            <span className="text-[#6b7280] flex items-center justify-between pl-14">≡ <span className="text-white ml-2">More Filters</span></span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-284 h-43.25">
                <div className="grid grid-cols-4 px-4 pb-3 text-[10px] tracking-[1px] text-[#8F8389] uppercase font-bold">
                    <div className="flex items-center p-3">
                        <span>Merchant</span>
                    </div>
                    <div className="flex items-center p-3">
                        <span>Price</span>
                    </div>
                    <div className="flex items-center p-3">
                        <span>Limits / Available</span>
                    </div>
                    <div className="flex items-center p-3">
                        <span className="text-right">Action</span>
                    </div>
                </div>

                <div className="space-y-2">
                    {offers.map((offer) => (
                        <div
                            key={offer.name}
                            className="grid grid-cols-4 items-center bg-[#161618] border border-[#1F2937] rounded-3xl px-4 py-5 hover:border-[#2a2a2a] hover:bg-[#181818] transition-all duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#343434] flex items-center justify-center text-[#6b7280] text-[20px]" >
                                    👤
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{offer.name}</p>
                                    <p className="text-[11px] text-[#4b5563] mt-0.5">
                                        {offer.orders} orders |{" "}
                                        <span className="text-[#bced09]">{offer.completion} Completion</span>
                                    </p>
                                </div>
                            </div>
                            <div>
                                <span className="text-white font-bold text-lg tabular-nums">{offer.price}</span>
                                <span className="text-[#6b7280] text-xs ml-1">USD</span>
                                <p className="text-[10px] text-[#4b5563] mt-0.5 tracking-wide">1 BTC MARKET PRICE</p>
                            </div>
                            <div>
                                <p className="text-sm text-white">Available: <span className="font-semibold">{offer.available}</span></p>
                                <p className="text-[11px] text-[#6b7280] mt-0.5">Limit: {offer.limitMin} - {offer.limitMax}</p>
                            </div>
                            <div className="flex">
                                <button className="bg-[#bced09] hover:bg-[#d4f53a] text-black text-sm font-bold px-6 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95">
                                    Buy BTC
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/*Modal*/}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-[black/60] backdrop-blur-sm z-40 flex items-center justify-end"
                    onClick={() => setIsOpen(false)} // cierra al clickear afuera
                >
                    <div
                        className="bg-[#0D1117F2] h-full w-md p-8 border-r border-white/10"
                        onClick={(e) => e.stopPropagation()} // evita cerrar al clickear adentro
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white text-lg font-semibold">Create New Offer</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="w-full h-px mb-6" style={{ background: 'linear-gradient(to right, #BCED0900, #BCED09, #BCED0900)' }} />

                        <div className="w-99.75 h-12">
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

                            <div className="flex w-full items-center justify-center gap-3 mt-10">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 bg-[#BCED09] text-black font-semibold px-4 py-3 rounded-xl hover:bg-[#9ac208] transition-colors"
                                >
                                    Publish Offer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}