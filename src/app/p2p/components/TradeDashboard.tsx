"use client";

import { useState } from "react";

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

    return (
        <div className="w-[1232px] h-[984px] border-r border-[#1F2937] pt-12">
            <div className="w-[1136px] h-[173px]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex bg-[#1a1a1a] rounded-lg p-1">
                        {["Buy", "Sell"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-6 py-2 rounded-[8px] text-sm font-bold transition-all duration-200
                                    ${tab === t
                                        ? "bg-[#343434] text-[#BCED09]"
                                        : "text-[#6b7280] hover:text-white"
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 bg-[#BCED09] text-black text-sm font-bold px-4 py-2 rounded-2xl transition-all duration-200">
                        <span className="text-sm leading-none">+</span>
                        Create Offer
                    </button>
                </div>

                <div className="flex items-center justify-between bg-[#161618] border border-[#1F2937] rounded-3xl h-[99px] px-5 gap-4">
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
            <div className="w-[1136px] h-[173px]">
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
        </div>
    );
}