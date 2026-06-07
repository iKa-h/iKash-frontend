"use client";

import { useState, useRef, useEffect } from "react";
import { useEscrows } from "@/features/escrow/hooks/useEscrows";
import { useOrders } from "@/features/order/hooks/useOrders";
import { walletService } from "@/features/wallet/application/wallet.service";
import { Info, Upload, FileUp, CircleCheck, Loader2 } from "lucide-react";

export interface TradeEvidenceUploaderProps {
    orderId: string;
    escrowId?: string | null;
    escrowStatus: "pending" | "initialized" | "funded" | "fiat_sent" | "released" | "disputed" | "resolved";
    buyerAddress?: string | null;
    amount: number;
    onStatusChange: () => void;
}

export function TradeEvidenceUploader({
    orderId,
    escrowId,
    escrowStatus,
    buyerAddress,
    amount,
    onStatusChange
}: TradeEvidenceUploaderProps) {
    const { markFiatSent, syncEscrow } = useEscrows();
    const { updateOrder } = useOrders();

    const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const sizeInKb = (file.size / 1024).toFixed(1);
            setUploadedFile({ name: file.name, size: `${sizeInKb} KB` });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            const sizeInKb = (file.size / 1024).toFixed(1);
            setUploadedFile({ name: file.name, size: `${sizeInKb} KB` });
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleAction = async () => {
        if (isSubmitting || !buyerAddress || !escrowId) return;
        setIsSubmitting(true);

        try {
            if (escrowStatus === "funded") {
                const res = await markFiatSent(escrowId, {
                    buyerAddress,
                    evidence: uploadedFile ? `File: ${uploadedFile.name}` : "Payment evidence"
                });
                const unsignedXdr = res.unsignedFundTransaction || res.unsignedTransaction;
                if (!unsignedXdr) throw new Error("Confirmation failed: no unsigned XDR returned");
                
                const signedXdr = await walletService.signTransaction(unsignedXdr);
                await syncEscrow({ escrowId, action: "fiat_sent", signedXdr });
                
                alert("Payment confirmed and registered successfully!");
                onStatusChange();
            }
        } catch (err: any) {
            console.error(err);
            alert(`Error processing action: ${err.message || err}`);
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
                return "Waiting for the seller to lock the funds in the smart Escrow contract.";
            case "funded":
                return "Ensure the payment receipt clearly shows the destination IBAN and transaction reference. Operations are monitored 24/7 for security.";
            case "fiat_sent":
                return "Payment sent! Waiting for the seller to verify the funds and release the locked crypto from the escrow.";
            case "released":
                return "The transaction has been successfully completed. The cryptocurrency has been released to your wallet.";
            default:
                return "Transaction in progress.";
        }
    };

    return (
        <div className="bg-[#161618] w-[402.8px] h-[571.5px] rounded-[16px] flex flex-col justify-between p-[12px_16px] gap-6 font-space shrink-0 select-none">
            
            {/* Header Info Banner */}
            <div className="bg-[#1B1B21] border-l border-[rgba(69,73,50,0.3)] rounded-[8px] p-[20px_12px] h-[99px] flex gap-3 shrink-0">
                <span className="w-[11.67px] h-[11.67px] bg-[#DAFF00] rounded-full flex items-center justify-center shrink-0 mt-1 shadow-[0_0_8px_rgba(218,255,0,0.5)]">
                    <Info className="w-[8px] h-[8px] text-black stroke-[3.5px]" />
                </span>
                <p className="text-[#C2C7D0] text-[12px] leading-[20px] font-manrope font-normal">
                    {renderStatusDescription()}
                </p>
            </div>

            {/* Upload Body Area */}
            <div className="flex-1 flex flex-col justify-center items-center gap-4 shrink-0 min-h-0">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*,application/pdf"
                />
                
                {escrowStatus !== "released" && (
                    <button 
                        type="button" 
                        onClick={triggerUpload}
                        disabled={escrowStatus !== "funded"}
                        className="bg-[#DAFF00] disabled:bg-[#1F1F25] disabled:text-[rgba(143,131,137,0.5)] w-full h-[48px] text-[#2B3400] font-extrabold text-[16px] leading-[24px] rounded-[12px] hover:bg-[#c2e500] uppercase transition-all duration-200 flex items-center justify-center gap-2 select-none tracking-[-0.4px] disabled:cursor-not-allowed shrink-0"
                    >
                        <Upload className="w-4.5 h-4.5 stroke-[2.5px]" /> Upload Evidence
                    </button>
                )}

                {escrowStatus === "released" ? (
                    /* High fidelity Mockup Evidence Preview when Completed */
                    <div className="border border-[#DAFF00]/30 bg-[#1B1B21] w-full h-[276.5px] rounded-[12px] flex flex-col items-center justify-between p-6 select-none shadow-[inset_0_0_12px_rgba(218,255,0,0.05)] transition-all duration-300">
                        <div className="w-full flex items-center justify-between border-b border-[rgba(218,255,0,0.1)] pb-3">
                            <span className="text-[10px] text-[#64748B] font-bold tracking-[1px] uppercase">
                                EVIDENCE SUBMITTED
                            </span>
                            <span className="text-[9px] text-[#DAFF00] bg-[#DAFF00]/10 border border-[#DAFF00]/20 font-black p-[2px_8px] rounded-full uppercase tracking-wider">
                                Verified
                            </span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-2 my-auto">
                            <CircleCheck className="w-12 h-12 text-[#DAFF00] stroke-[2px] animate-pulse" />
                            <p className="text-[13px] font-black text-[#E4E1E9] mt-1 truncate max-w-[280px]">
                                sepa_payment_receipt_31a9.pdf
                            </p>
                            <p className="text-[10px] text-[#64748B] font-bold tracking-wider uppercase">
                                SIZE: 245.5 KB • SECURED ON-CHAIN
                            </p>
                        </div>
                        
                        <div className="w-full flex justify-between text-[10px] text-[#64748B] font-semibold border-t border-[rgba(218,255,0,0.05)] pt-3">
                            <span>TX REF: IK-9821-B</span>
                            <span>METHOD: SEPA BANK</span>
                        </div>
                    </div>
                ) : (
                    /* Standard Dropzone */
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={escrowStatus === "funded" ? triggerUpload : undefined}
                        className={`border-2 border-dashed w-full h-[214.5px] rounded-[12px] flex flex-col items-center justify-center transition-all duration-200 select-none ${
                            escrowStatus !== "funded"
                                ? "border-[rgba(143,131,137,0.2)] bg-[#1B1B21]/10 cursor-not-allowed"
                                : isDragging 
                                    ? "border-[#DAFF00] bg-[#DAFF00]/5 cursor-pointer" 
                                    : uploadedFile 
                                        ? "border-[#DAFF00]/50 bg-[#1B1B21] cursor-pointer" 
                                        : "border-[rgba(143,131,137,0.8)] hover:border-[#DAFF00]/40 bg-[#161618] cursor-pointer"
                        }`}
                    >
                        {uploadedFile ? (
                            <div className="text-center p-4">
                                <p className="text-[14px] font-bold text-[#DAFF00] truncate max-w-[240px]">{uploadedFile.name}</p>
                                <p className="text-[11px] text-[rgba(143,131,137,0.8)] mt-1 font-semibold">{uploadedFile.size}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <FileUp className="w-8 h-8 text-[rgba(143,131,137,0.8)]" />
                                <p className="text-[16px] font-medium leading-[24px] text-[rgba(143,131,137,0.8)] text-center tracking-normal font-space max-w-[200px]">
                                    Drop your evidence file here
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Action Footer */}
            <div className="flex flex-col gap-3 shrink-0">
                {escrowStatus === "pending" || escrowStatus === "initialized" ? (
                    <button type="button" disabled className="bg-[#2A292F] w-full h-[56px] text-[#C2C7D0] font-extrabold text-[16px] leading-[24px] rounded-[12px] uppercase cursor-not-allowed tracking-[-0.4px]">
                        WAITING FOR FUNDING
                    </button>
                ) : escrowStatus === "funded" ? (
                    <button 
                        type="button" 
                        onClick={handleAction}
                        disabled={isSubmitting}
                        className="bg-[#DAFF00] w-full h-[56px] text-[#2B3400] font-extrabold text-[16px] leading-[24px] rounded-[12px] hover:bg-[#c2e500] uppercase transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 tracking-[-0.4px]"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 text-[#2B3400] animate-spin" /> : <CircleCheck className="w-5 h-5 text-[#2B3400] stroke-[3px]" />}
                        {isSubmitting ? "PROCESSING..." : "MARK AS PAID"}
                    </button>
                ) : escrowStatus === "fiat_sent" ? (
                    <button type="button" disabled className="bg-[#2A292F] w-full h-[56px] text-[#C2C7D0] font-extrabold text-[16px] leading-[24px] rounded-[12px] uppercase cursor-not-allowed tracking-[-0.4px]">
                        WAITING FOR RELEASE
                    </button>
                ) : escrowStatus === "released" ? (
                    <div className="bg-[#DAFF00]/10 border border-[#DAFF00]/30 w-full h-[56px] rounded-[12px] flex items-center justify-center">
                        <span className="text-[#DAFF00] font-bold text-[16px] leading-[24px] uppercase tracking-[-0.4px]">COMPLETED!</span>
                    </div>
                ) : null}

                {escrowStatus !== "released" && (
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        className="bg-transparent hover:bg-white/[0.02] w-full h-[58px] text-[#C2C7D0] border border-[rgba(69,73,50,0.3)] font-bold text-[16px] leading-[24px] rounded-[12px] uppercase transition-all duration-200 tracking-[-0.4px]"
                    >
                        CANCEL OPERATION
                    </button>
                )
                }
            </div>
        </div>
    );
}