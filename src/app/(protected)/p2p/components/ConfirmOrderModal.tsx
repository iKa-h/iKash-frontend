"use client";

import { useState, useEffect, useMemo } from "react";
import { Offer } from "@/features/offer/models/offer";
import { Users } from "@/features/user/models/users";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useOrders } from "@/features/order/hooks/useOrders";
import { useEscrows } from "@/features/escrow/hooks/useEscrows";
import { walletService } from "@/features/wallet/application/wallet.service";
import { useWalletBalance } from "@/features/wallet/presentation/hooks/useWalletBalance";
import { useRouter } from "next/navigation";
import { useNotification } from "../../../components/NotificationContext";

interface ConfirmOrderModalProps {
    offer: Offer;
    creator: Users;
    onClose: () => void;
}

export function ConfirmOrderModal({ offer, creator, onClose }: ConfirmOrderModalProps) {
    const { currentUser } = useUser();
    const { createOrder } = useOrders();
    const { syncEscrow } = useEscrows();
    const router = useRouter();
    const { notify } = useNotification();

    const [amountToPay, setAmountToPay] = useState("");
    const [selectedPaymentId, setSelectedPaymentId] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [stats, setStats] = useState<{ totalOrders: number; completedOrders: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const isBuyOperation = offer.type === "sell"; // Merchant is selling, User is BUYING crypto
    const priceNum = parseFloat(offer.price) || 0;
    const minLimit = parseFloat(offer.minAmount) || 0;
    const maxLimit = parseFloat(offer.maxAmount) || 0;

    // Fetch counterparty stats
    useEffect(() => {
        if (!creator?.userId) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/user-stats/${creator.userId}`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Error fetching user stats:", err));
    }, [creator?.userId]);

    // Calculate Completion Rate
    const completionRate = useMemo(() => {
        if (!stats || stats.totalOrders === 0) return "NA";
        const rate = (stats.completedOrders / stats.totalOrders) * 100;
        return `${rate.toFixed(1)}%`;
    }, [stats]);

    // Determine relevant seller public key for balance validation
    const sellerPublicKey = isBuyOperation ? creator?.publicKey : currentUser?.publicKey;
    const { balance, balances } = useWalletBalance(sellerPublicKey || null);

    const availableCrypto = useMemo(() => {
        if (!sellerPublicKey) return 0;
        const normalizedAsset = offer.assetCode === "XLM" || offer.assetCode === "native" ? "native" : offer.assetCode;
        if (normalizedAsset === "native") {
            return parseFloat(balance || "0") || 0;
        }
        const found = balances.find(b => b.asset_code === normalizedAsset);
        return found ? parseFloat(found.balance) || 0 : 0;
    }, [balance, balances, offer.assetCode, sellerPublicKey]);

    // Intersect Payment Methods
    const intersectingMethods = useMemo(() => {
        const creatorMethods: any[] = [
            ...(offer.payment_methods || []),
            ...(offer.paymentMethods || [])
        ];

        const userMethods: any[] = [
            ...(currentUser?.payment_method || []),
            ...(currentUser?.paymentMethods || [])
        ];

        if (!creatorMethods.length || !userMethods.length) return [];

        const matches: { id: string; label: string; desc: string }[] = [];

        userMethods.forEach(um => {
            const umProviderId = um.provider_id || um.bankName;
            const umLabel = um.payment_provider?.name || um.bankName || um.type;
            const umDesc = um.account_identifier || um.accountDetails || "";

            const matchFound = creatorMethods.some(cm => {
                const cmProviderId = cm.provider_id || cm.bankName;
                return cmProviderId === umProviderId;
            });

            if (matchFound) {
                matches.push({
                    id: um.payment_id || um.paymentId,
                    label: umLabel,
                    desc: umDesc
                });
            }
        });

        return matches;
    }, [offer.payment_methods, offer.paymentMethods, currentUser]);

    useEffect(() => {
        if (intersectingMethods.length > 0 && !selectedPaymentId) {
            setSelectedPaymentId(intersectingMethods[0].id);
        }
    }, [intersectingMethods]);

    const selectedMethodObj = useMemo(() => {
        return intersectingMethods.find(m => m.id === selectedPaymentId) || intersectingMethods[0];
    }, [intersectingMethods, selectedPaymentId]);

    // Real-time conversion calculations
    const inputNum = parseFloat(amountToPay) || 0;

    const amountToReceive = useMemo(() => {
        if (priceNum <= 0) return "0.00";
        if (isBuyOperation) {
            // User pays USD (fiat), receives Crypto
            const cryptoVal = inputNum / priceNum;
            return isNaN(cryptoVal) ? "0.00" : cryptoVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
        } else {
            // User sells Crypto, receives USD (fiat)
            const fiatVal = inputNum * priceNum;
            return isNaN(fiatVal) ? "0.00" : fiatVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }, [inputNum, priceNum, isBuyOperation]);

    // Input Validation Check
    useEffect(() => {
        if (!amountToPay) {
            setErrorMsg("");
            return;
        }
        const compareVal = isBuyOperation ? inputNum : inputNum * priceNum; // Compare against fiat limits

        if (compareVal < minLimit) {
            setErrorMsg(`Min amount is ${minLimit.toLocaleString()} USD`);
        } else if (compareVal > maxLimit) {
            setErrorMsg(`Max amount is ${maxLimit.toLocaleString()} USD`);
        } else if (!isBuyOperation && inputNum > availableCrypto) {
            setErrorMsg(`Exceeds available balance (${availableCrypto.toLocaleString()} ${offer.assetCode || "BTC"})`);
        } else {
            setErrorMsg("");
        }
    }, [amountToPay, inputNum, priceNum, minLimit, maxLimit, availableCrypto, offer.assetCode, isBuyOperation]);

    const handleInitiateOrder = async () => {
        if (!currentUser) {
            notify("error", "Please login first.");
            return;
        }
        if (errorMsg || !amountToPay || parseFloat(amountToPay) <= 0) {
            notify("warning", "Please correct amount errors before initiating.");
            return;
        }
        if (intersectingMethods.length === 0) {
            notify("error", "No matching payment methods between you and the offer creator.");
            return;
        }

        setIsSubmitting(true);
        try {
            const fiatAmountVal = isBuyOperation ? inputNum : inputNum * priceNum;
            const assetAmountVal = isBuyOperation ? inputNum / priceNum : inputNum;

            const sellerAddress = isBuyOperation ? creator?.publicKey : currentUser?.publicKey;
            const buyerAddress = isBuyOperation ? currentUser?.publicKey : creator?.publicKey;

            // Single unified call — backend deploys escrow on TW first,
            // then persists Order + EscrowOnChain atomically.
            // If escrow deployment fails, no DB record is created.
            const orderData: any = await createOrder({
                offerId: offer.offerId,
                buyerId: isBuyOperation ? currentUser.userId : offer.creatorId,
                sellerId: isBuyOperation ? offer.creatorId : currentUser.userId,
                fiatAmount: fiatAmountVal.toString(),
                assetAmount: assetAmountVal.toString(),
                sellerAddress: sellerAddress || "",
                buyerAddress: buyerAddress || "",
                assetCode: offer.assetCode || "XLM",
                title: `Order for ${offer.assetCode || "XLM"}`,
            });

            if (!orderData?.orderId) {
                notify("error", "Order created but missing orderId. Check transactions.");
                onClose();
                return;
            }

            const unsignedXdr = orderData?.unsignedFundTransaction || null;
            const escrowId = orderData?.escrow?.escrowId || null;

            // If current user is the seller -> prompt wallet signing and sync
            if (!isBuyOperation) {
                if (!unsignedXdr) {
                    notify("warning", "Order and escrow created. Merchant must fund the escrow from dashboard.");
                    router.push("/p2p/orders/" + orderData.orderId.replace(/-/g, ""));
                    return;
                }

                // Sign using connected wallet
                try {
                    const signedXdr = await walletService.signTransaction(unsignedXdr);
                    await syncEscrow({ escrowId: escrowId, action: "fund", signedXdr });
                    notify("success", "Escrow funded successfully. Redirecting to trade view.");
                    router.push("/p2p/orders/" + orderData.orderId.replace(/-/g, ""));
                    return;
                } catch (signErr) {
                    console.error("Signing or sync failed:", signErr);
                    notify("error", "Failed to sign or sync the escrow transaction. Merchant should fund the escrow from trade page.");
                    router.push("/p2p/orders/" + orderData.orderId.replace(/-/g, ""));
                    return;
                }
            }

            // If current user is the buyer -> notify and redirect
            notify("success", "Order initiated and escrow contract created. The seller has been notified to fund the escrow.");
            router.push("/p2p/orders/" + orderData.orderId.replace(/-/g, ""));

        } catch (err: any) {
            console.error(err);
            const msg = err?.message || "Error initiating order. Please try again.";
            notify("error", msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { if (!isSubmitting) onClose(); }}
        >
            <style>
                {`
                @keyframes slideUpCenter {
                    0% { transform: translateY(50px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-slideUpCenter {
                    animation: slideUpCenter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                `}
            </style>
            
            {isSubmitting ? (
                <div className="flex flex-col items-center justify-center animate-slideUpCenter">
                    <div className="relative flex items-center justify-center w-28 h-28 mb-8">
                        <div className="absolute w-full h-full border-4 border-[#DAFF00]/10 rounded-full"></div>
                        <div className="absolute w-full h-full border-4 border-[#DAFF00] rounded-full border-t-transparent animate-spin drop-shadow-[0_0_20px_rgba(218,255,0,0.6)]"></div>
                        <div className="absolute w-20 h-20 border-4 border-[#DAFF00]/20 rounded-full border-b-transparent animate-[spin_1.5s_linear_infinite_reverse]"></div>
                        <div className="absolute w-12 h-12 border-4 border-[#DAFF00]/30 rounded-full border-l-transparent animate-[spin_2s_linear_infinite]"></div>
                    </div>
                    <h3 className="text-[#DAFF00] font-semibold text-2xl tracking-wide animate-pulse mb-3 font-space text-center">
                        Initiating Trade...
                    </h3>
                    <p className="text-[#E4E1E9]/70 text-sm text-center max-w-[340px] px-4 leading-relaxed font-space">
                        Please wait. We are creating the order, securing the escrow contract on the blockchain, and syncing the database. This might take a moment.
                    </p>
                </div>
            ) : (
            <div 
                className="bg-[#0E0E13] border border-[#454932]/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-lg w-full max-w-[576px] flex flex-col overflow-hidden animate-fadeIn"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#454932]/10 h-[81px]">
                    <h2 className="text-[#E4E1E9] font-bold text-2xl font-space">
                        {isBuyOperation ? "Confirm Buy Order" : "Confirm Sell Order"}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-[#C6C9AC]/10 hover:bg-[#C6C9AC]/20 flex items-center justify-center text-[#C6C9AC] transition-colors cursor-pointer"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col gap-8 flex-1 overflow-y-auto">
                    {/* 1. Counterparty Info */}
                    <div className="bg-[#1F1F25] border-l-4 border-[#CEF100] rounded-lg p-4 flex items-center justify-between h-[80px]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#39383F] border border-[#454932]/30 flex items-center justify-center text-[#E4E1E9] font-bold text-lg shrink-0 overflow-hidden shadow-inner">
                                👤
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[#E4E1E9] font-bold text-lg font-space leading-tight">
                                        {creator?.alias || "Merchant"}
                                    </span>
                                    <span className="w-3.5 h-3.5 rounded-full bg-[#DAFF00] flex items-center justify-center text-black text-[9px] font-extrabold shadow-sm">
                                        ✓
                                    </span>
                                </div>
                                <span className="text-[#8F8389] text-xs font-medium">Verified Merchant</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[#DAFF00] font-bold text-base font-space">
                                {completionRate}
                            </span>
                            <span className="text-[#C6C9AC] text-[10px] tracking-[1px] uppercase mt-0.5">
                                COMPLETION RATE
                            </span>
                        </div>
                    </div>

                    {/* 2. Order Form */}
                    <div className="flex flex-col gap-6">
                        {/* Payment Method Select */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#C6C9AC] text-xs font-normal tracking-[1.2px] uppercase font-space">
                                PAYMENT METHOD
                            </label>
                            <div className="relative">
                                {intersectingMethods.length > 0 ? (
                                    <>
                                        <div
                                            className="bg-[#0D1117] border border-[#1C2128] rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-[#DAFF00]/40 transition-colors"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        >
                                            <span className="text-[#F1F5F9] text-[16px] font-semibold">
                                                {selectedMethodObj 
                                                    ? `${selectedMethodObj.label} ${selectedMethodObj.desc ? `(${selectedMethodObj.desc})` : ''}` 
                                                    : "Select payment method..."}
                                            </span>
                                            <svg className={`w-5 h-5 text-[#94A3B8] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        {isDropdownOpen && (
                                            <div className="absolute z-20 w-full mt-2 bg-[#1a1d27] rounded-xl border border-white/10 shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                                                {intersectingMethods.map(m => (
                                                    <div
                                                        key={m.id}
                                                        onClick={() => {
                                                            setSelectedPaymentId(m.id);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`px-5 py-3 text-[16px] cursor-pointer transition-colors flex items-center justify-between ${
                                                            selectedPaymentId === m.id 
                                                            ? 'bg-[#DAFF00]/15 text-[#DAFF00] font-bold' 
                                                            : 'text-[#F1F5F9] hover:bg-white/10'
                                                        }`}
                                                    >
                                                        <span>{m.label} {m.desc ? `(${m.desc})` : ""}</span>
                                                        {selectedPaymentId === m.id && (
                                                            <span className="text-[#DAFF00] font-bold">✓</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-[#0D1117] border border-[#1C2128] rounded-xl px-5 py-4 flex items-center">
                                        <span className="text-[#EF4444] text-sm font-semibold">
                                            ⚠️ No intersecting payment methods available
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#C6C9AC] text-xs font-normal tracking-[1.2px] uppercase font-space">
                                {isBuyOperation ? "AMOUNT TO PAY" : "AMOUNT TO SELL"}
                            </label>
                            <div className="bg-[#1B1B21] border border-[#454932]/20 rounded-lg h-[66px] flex items-center justify-between px-4">
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amountToPay}
                                    onChange={e => setAmountToPay(e.target.value)}
                                    className="bg-transparent text-[#E4E1E9] font-bold text-2xl font-space outline-none w-full placeholder:text-[#39383F] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <div className="border-l border-[#454932]/20 pl-4 py-1 flex items-center gap-1.5 shrink-0">
                                    <span className="text-[#E4E1E9] font-bold text-base font-space">
                                        {isBuyOperation ? "USD" : offer.assetCode || "BTC"}
                                    </span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6C9AC] opacity-75" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-1 px-1 text-xs">
                                <span className="text-[#C6C9AC] text-[10px] uppercase font-space tracking-wide">
                                    LIMIT: {minLimit.toLocaleString()} - {maxLimit.toLocaleString()} USD
                                </span>
                                {errorMsg ? (
                                    <span className="text-[#EF4444] text-xs font-semibold animate-pulse">
                                        {errorMsg}
                                    </span>
                                ) : (
                                    <span className="text-[#B5D400] text-[10px] uppercase font-space">
                                        Available: {availableCrypto.toLocaleString()} {offer.assetCode || "BTC"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. Conversion Details */}
                    <div className="bg-[#1F1F25] rounded-lg p-6 flex flex-col gap-4 shadow-sm border border-white/[0.02]">
                        <div className="flex items-center justify-between pb-4 border-b border-[#454932]/10">
                            <span className="text-[#C6C9AC] text-[10px] uppercase tracking-[1px] font-space">
                                EXCHANGE RATE
                            </span>
                            <span className="text-[#E4E1E9] font-medium text-sm font-space">
                                1 {offer.assetCode || "BTC"} = {priceNum.toLocaleString()} USD
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 pt-1">
                            <span className="text-[#C6C9AC] text-[10px] uppercase tracking-[1px] font-space">
                                AMOUNT TO RECEIVE
                            </span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-[#DAFF00] font-bold text-4xl font-space tracking-tight">
                                    {amountToReceive}
                                </span>
                                <span className="text-[#DAFF00] font-bold text-lg font-space tracking-wide opacity-90">
                                    {isBuyOperation ? offer.assetCode || "BTC" : "USD"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Action Buttons */}
                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            type="button"
                            disabled={isSubmitting || !!errorMsg || !amountToPay || intersectingMethods.length === 0}
                            onClick={handleInitiateOrder}
                            className="w-full bg-[#DAFF00] hover:bg-[#d4f53a] text-[#181E00] font-bold text-lg py-4 rounded-lg shadow-[0_0_30px_rgba(218,255,0,0.15)] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-space"
                        >
                            <span>Initiate Order</span>
                            <svg viewBox="0 0 24 24" className="w-5 h-5 ml-1" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="w-full bg-[#2A292F] hover:bg-[#35343b] text-[#E4E1E9] font-bold text-base py-3.5 rounded-lg transition-colors cursor-pointer font-space"
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Footer Security Note */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                        <div className="w-2 h-2 rounded-full bg-[#C6C9AC]/60 animate-pulse" />
                        <span className="text-[#C6C9AC]/60 text-[10px] uppercase tracking-[2px] font-space">
                            ESCROW SECURED • ~5 MINS COMPLETION
                        </span>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}
