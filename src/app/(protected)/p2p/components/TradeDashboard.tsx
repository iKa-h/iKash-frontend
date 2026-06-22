"use client";

import { useEffect, useState } from "react";
import { CreateOfferModal } from "./CreateOfferModal";
import { ConfirmOrderModal } from "./ConfirmOrderModal";
import { useOffers } from "@/features/offer/hooks/useOffers";
import { useUsers } from "@/features/user/hooks/useUsers";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { KycBanner } from "@/app/components/KycBanner";
import { useWalletBalance } from "@/features/wallet/presentation/hooks/useWalletBalance";
import { Offer } from "@/features/offer/models/offer";

function MerchantBalance({ publicKey, assetCode }: { publicKey?: string; assetCode?: string }) {
    const { balance, balances, isLoading } = useWalletBalance(publicKey || null);

    if (isLoading) return <span className="animate-pulse">...</span>;
    if (!publicKey) return <span>0.00</span>;

    const normalizedAssetCode = assetCode === "XLM" || assetCode === "native" ? "native" : assetCode;

    if (normalizedAssetCode === "native") {
        return <span>{balance || "0.00"}</span>;
    }

    const asset = balances.find(b => b.asset_code === normalizedAssetCode);
    if (!asset) return <span>0.00</span>;

    return <span>{parseFloat(asset.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
}

export function TradeDashboard() {
    const [tab, setTab] = useState("Buy");
    const [amount, setAmount] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    // If user wants to "Buy", they need to see offers where the merchant is "selling".
    // If user wants to "Sell", they need to see offers where the merchant is "buying".
    const { offers } = useOffers({ type: tab === "Buy" ? "sell" : "buy" });
    // Filter out offers that have been executed/archived server-side
    const visibleOffers = offers.filter(o => !o.executed);

    const { getUser, userFound } = useUsers();
    const { currentUser } = useUser();

    const isVerified = currentUser?.kycStatus === "approved";

    useEffect(() => {
        offers.forEach((offer) => {
            if (offer?.creatorId) {
                getUser(offer.creatorId);
            }
        });
    }, [offers]);

    return (
        <div className="w-full flex flex-col pt-8 pb-12 px-1">
            <KycBanner />

            <div className="w-full mb-8 px-2">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex bg-[#1a1a1a] rounded-xl p-1 w-full md:w-auto">
                        {["Buy", "Sell"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-base font-bold transition-all duration-200
                                ${tab === t
                                    ? "bg-[#343434] text-[#BCED09]"
                                    : "text-[#6b7280] hover:text-white"
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            if (!isVerified) {
                                alert("KYC verification required to create offers.");
                                return;
                            }
                            setIsOpen(true);
                        }}
                        disabled={!isVerified}
                        title={!isVerified ? "KYC verification required" : ""}
                        className={`flex items-center justify-center gap-2 text-base font-bold px-6 py-3 rounded-2xl transition-all duration-200 w-full md:w-auto ${isVerified ? "bg-[#BCED09] text-black hover:bg-[#d4f53a]" : "bg-gray-700 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        <span className="text-lg leading-none">+</span>
                        Create Offer
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-full px-2">
                <div className="space-y-4">
                    {visibleOffers.map((offer) => (
                        <div
                            key={offer.offerId}
                            className="bg-[#161618] border border-[#1F2937] rounded-2xl p-5 hover:border-[#2a2a2a] hover:bg-[#181818] transition-all duration-200"
                        >
                            {/* Merchant Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-full bg-[#343434] flex items-center justify-center text-[#6b7280] text-[24px]">
                                        👤
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-lg">{userFound[offer.creatorId]?.alias}</p>
                                        <p className="text-[#BCED09] text-xs font-medium">1,420 ORDERS • 98.5%</p>
                                    </div>
                                </div>
                                <div className="text-[#BCED09]">
                                    ✓
                                </div>
                            </div>

                            {/* Middle Section */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-[#8F8389] text-xs uppercase mb-1">Available</p>
                                    <p className="text-white font-semibold text-base">
                                        <MerchantBalance publicKey={userFound[offer.creatorId]?.publicKey} assetCode={offer.assetCode} /> {offer.assetCode}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[#8F8389] text-xs uppercase mb-1 text-right">Limits</p>
                                    <p className="text-white font-semibold text-base text-right">
                                        {offer.minAmount} - {offer.maxAmount}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="mb-4">
                                <p className="text-[#8F8389] text-xs uppercase mb-2">Payment Methods</p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="text-white font-semibold text-sm">ZELLE</span>
                                    <span className="text-white font-semibold text-sm">WIRE</span>
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[#8F8389] text-xs uppercase mb-1">Unit Price</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[#BCED09] font-bold text-3xl">{offer.price}</span>
                                        <span className="text-[#8F8389] text-sm">USD</span>
                                    </div>
                                </div>
                                <button
                                    disabled={!isVerified}
                                    onClick={() => {
                                        if (!isVerified) {
                                            alert("KYC verification required to trade.");
                                            return;
                                        }
                                        setSelectedOffer(offer);
                                    }}
                                    title={!isVerified ? "KYC verification required" : ""}
                                    className={`text-base font-bold px-8 py-3 rounded-xl transition-all duration-200 w-[45%] ${isVerified ? "bg-[#bced09] hover:bg-[#d4f53a] text-black hover:scale-105 active:scale-95" : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    {tab === "Buy" ? "BUY" : "SELL"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isOpen && (
                <CreateOfferModal onClose={() => setIsOpen(false)} />
            )}

            {selectedOffer && userFound[selectedOffer.creatorId] && (
                <ConfirmOrderModal
                    offer={selectedOffer}
                    creator={userFound[selectedOffer.creatorId]}
                    onClose={() => setSelectedOffer(null)}
                />
            )}
        </div>
    );
}
