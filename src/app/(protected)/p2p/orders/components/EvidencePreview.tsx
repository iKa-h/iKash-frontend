"use client";

import { useState, useEffect } from "react";
import { useEscrows } from "@/features/escrow/hooks/useEscrows";
import { useOrders } from "@/features/order/hooks/useOrders";
import { walletService } from "@/features/wallet/application/wallet.service";
import { Info, CircleCheck, Loader2, Eye } from "lucide-react";

export interface EvidencePreviewProps {
    orderId: string;
    escrowId?: string | null;
    escrowStatus: "pending" | "initialized" | "funded" | "fiat_sent" | "released" | "disputed" | "resolved";
    sellerAddress?: string | null;
    amount: number;
    expiresAt?: string;
    onStatusChange: () => void;
}

export function EvidencePreview({
    orderId,
    escrowId,
    escrowStatus,
    sellerAddress,
    amount,
    expiresAt,
    onStatusChange
}: EvidencePreviewProps) {
    const { fundEscrow, releaseEscrow, syncEscrow } = useEscrows();
    const { updateOrder } = useOrders();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>("00:00");
    const [isExpired, setIsExpired] = useState(false);
    // Eliminado: unsignedXdr y copied

    useEffect(() => {
        if (!expiresAt) return;
        const target = new Date(expiresAt).getTime();
        
        const updateTimer = () => {
            const now = Date.now();
            const diff = target - now;
            if (diff <= 0) {
                setTimeLeft("00:00");
                setIsExpired(true);
            } else {
                const m = Math.floor(diff / 60000);
                const s = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
                setIsExpired(false);
            }
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [expiresAt]);

    const handleFundAction = async () => {
        if (isSubmitting || !sellerAddress || !escrowId){
            alert("Cannot fund escrow: missing required information.");
            console.warn("Fund action blocked due to missing data:", { sellerAddress, escrowId });
            return;
        } 
        console.log("Initiating escrow funding process for escrowId:", escrowId);
        setIsSubmitting(true);
        try {
            const res = await fundEscrow({ escrowId, signerAddress: sellerAddress, amount });
            const unsignedXdr = res.unsignedFundTransaction || res.unsignedTransaction;
            if (!unsignedXdr) throw new Error("Funding failed: no unsigned XDR returned");
            // Firmar automáticamente usando el walletService interno
            const signedXdr = await walletService.signTransaction(unsignedXdr);
            await syncEscrow({ escrowId, action: "fund", signedXdr });
            await updateOrder({ orderStatus: "locked" }, orderId);
            alert("Escrow funded successfully on-chain!");
            onStatusChange();
        } catch (err: any) {
            console.error(err);
            alert(`Error: ${err.message || err}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReleaseAction = async () => {
        if (isSubmitting || !sellerAddress || !escrowId) return;
        setIsSubmitting(true);
        try {
            const res = await releaseEscrow({ escrowId, releaseSigner: sellerAddress });
            const unsignedXdr = res.unsignedFundTransaction || res.unsignedTransaction;
            if (!unsignedXdr) throw new Error("Release failed: no unsigned XDR returned");
            
            const signedXdr = await walletService.signTransaction(unsignedXdr);
            await syncEscrow({ escrowId, action: "release", signedXdr });
            await updateOrder({ orderStatus: "released" }, orderId);
            
            alert("Crypto released successfully!");
            onStatusChange();
        } catch (err: any) {
            console.error(err);
            alert(`Error releasing crypto: ${err.message || err}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (confirm("Are you sure you want to cancel this P2P operation?")) {
            alert("Operation cancelled.");
        }
    };

    const renderStatusDescription = () => {
        switch (escrowStatus) {
            case "pending":
            case "initialized":
                return "You must fund the Escrow contract to lock the crypto so the buyer can proceed.";
            case "funded":
                return "The buyer is currently transferring fiat funds. You will be notified when marked as paid.";
            case "fiat_sent":
                return "The buyer has marked the payment as sent! Please verify the funds are cleared in your bank account before releasing the crypto.";
            case "released":
                return "The transaction has been successfully completed. The cryptocurrency has been released to the buyer.";
            default:
                return "Transaction in progress.";
        }
    };

    const isUnfunded = escrowStatus === "pending" || escrowStatus === "initialized";
    const isWaitingForBuyer = escrowStatus === "funded";
    const hasEvidence = escrowStatus === "fiat_sent" || escrowStatus === "released";

    return (
        <div className="bg-[#161618] w-full rounded-xl flex flex-col justify-between p-[12px_16px] gap-6 font-space shrink-0 select-none">
            
            {/* 1. Estilos Locales de Inyección para Animación Shimmer de lado a lado */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes sideToSide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
                .animate-side-to-side {
                    animation: sideToSide 2s infinite ease-in-out;
                }
            `}} />

            {/* Minimalist Central Body View Area */}
            <div className="flex-1 flex flex-col justify-center items-center gap-4 shrink-0 min-h-0 w-full h-50">
                {isUnfunded && (
                    <div className="w-full flex flex-col items-center justify-center h-full border border-white/[0.02] bg-[#1B1B21]/40 rounded-[12px] p-4 text-center">
                        <span className="text-3xl mb-2">🔒</span>
                        <p className="text-[15px] font-bold text-[#C2C7D0]">Escrow Contract Awaiting Funds</p>
                        <p className="text-[12px] text-[rgba(143,131,137,0.8)] mt-1 max-w-[240px]">
                            Lock your assets in escrow to establish a secure trading environment.
                        </p>
                    </div>
                )}

                {isWaitingForBuyer && (
                    <div className="w-full flex flex-col justify-center items-center h-full p-6">
                        <div className="flex flex-col items-center text-center gap-2 w-full">
                            <span className="text-2xl mb-1 opacity-70">📑</span>
                            <p className="text-[16px] font-bold text-[#FFFFFF] tracking-wide">No Evidence Uploaded</p>
                            <p className="text-[13px] text-[rgba(143,131,137,0.8)] font-medium max-w-[240px]">
                                Waiting for the buyer to upload a payment receipt.
                            </p>
                        </div>
                        
                        {/* Indeterminate Moving Loader Line */}
                        <div className="w-[200px] h-[3px] bg-[#1F1F25] rounded-full overflow-hidden relative mt-6">
                            <div className="absolute top-0 bottom-0 left-0 bg-[#DAFF00] rounded-full w-1/4 animate-side-to-side" />
                        </div>
                    </div>
                )}

                {hasEvidence && (
                    <div className="w-full h-full flex flex-col gap-4">
                        <button 
                            type="button" 
                            onClick={() => alert("Opening receipt canvas container...")}
                            className="bg-[#1F1F25] border border-white/[0.04] w-full h-[48px] text-[#DAFF00] font-bold text-[16px] leading-[24px] rounded-[12px] uppercase flex items-center justify-center gap-2 tracking-[-0.4px] hover:bg-white/[0.04] transition-colors"
                        >
                            <Eye className="w-4.5 h-4.5 stroke-[2.5px]" /> VIEW RECEIPT
                        </button>

                        <div className="border border-white/[0.05] bg-[#1B1B21] w-full h-[214.5px] rounded-[12px] flex flex-col items-center justify-center overflow-hidden p-4 relative group">
                            <div className="text-center">
                                <p className="text-[13px] font-extrabold text-[#DAFF00] uppercase tracking-wider mb-2">Evidence Received</p>
                                <div className="w-[100px] h-[120px] bg-white rounded-[4px] mx-auto shadow-xl flex items-center justify-center border border-neutral-700">
                                    <span className="text-neutral-400 text-xs font-mono select-none">DOC_PROOF</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons Footer Block */}
            <div className="flex flex-col gap-3 shrink-0">
                {isUnfunded ? (
                    <button 
                        type="button" 
                        onClick={handleFundAction}
                        disabled={isSubmitting}
                        className="bg-[#DAFF00] w-full h-[56px] text-[#2B3400] font-extrabold text-[16px] leading-[24px] rounded-[12px] hover:bg-[#dcff15] hover:cursor-pointer uppercase transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 tracking-[-0.4px]"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 text-[#2B3400] animate-spin" /> : <CircleCheck className="w-5 h-5 text-[#2B3400] stroke-[3px]" />}
                        {isSubmitting ? "PROCESSING..." : "FUND ESCROW"}
                    </button>
                ) : isWaitingForBuyer ? (
                    isExpired ? (
                        <div className="bg-[#1F1F25] border border-red-500/50 w-full h-[56px] rounded-[12px] flex items-center justify-center">
                            <span className="text-red-500 font-bold text-[16px] leading-[24px] uppercase tracking-[-0.4px]">EXPIRED</span>
                        </div>
                    ) : (
                        <button type="button" disabled className="bg-[#2A292F] w-full h-[56px] text-[#C2C7D0] font-extrabold text-[16px] leading-[24px] rounded-[12px] uppercase cursor-not-allowed tracking-[-0.4px] flex items-center justify-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#DAFF00] animate-pulse shadow-[0_0_8px_rgba(218,255,0,0.6)]" />
                            WAITING FOR PAYMENT ({timeLeft})
                        </button>
                    )
                ) : escrowStatus === "fiat_sent" ? (
                    <button 
                        type="button" 
                        onClick={handleReleaseAction}
                        disabled={isSubmitting}
                        className="bg-[#DAFF00] w-full h-[56px] text-[#2B3400] font-extrabold text-[16px] leading-[24px] rounded-[12px] hover:bg-[#c2e500] uppercase transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 tracking-[-0.4px]"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 text-[#2B3400] animate-spin" /> : <CircleCheck className="w-5 h-5 text-[#2B3400] stroke-[3px]" />}
                        {isSubmitting ? "PROCESSING..." : "RELEASE CRYPTO"}
                    </button>
                ) : escrowStatus === "released" ? (
                    <div className="bg-[#DAFF00]/10 border border-[#DAFF00]/30 w-full h-[56px] rounded-[12px] flex items-center justify-center">
                        <span className="text-[#DAFF00] font-bold text-[16px] leading-[24px] uppercase tracking-[-0.4px]">COMPLETED!</span>
                    </div>
                ) : null}

                {/* Cancel Action Button */}
                {escrowStatus !== "released" && (
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        className="bg-transparent hover:bg-white/[0.02] w-full h-[58px] text-[#C2C7D0] border border-[rgba(69,73,50,0.3)] font-bold text-[16px] leading-[24px] rounded-[12px] uppercase transition-all duration-200 tracking-[-0.4px]"
                    >
                        CANCEL OPERATION
                    </button>
                )}
            </div>
        </div>
    );
}