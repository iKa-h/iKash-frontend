"use client";

import { Loader2 } from "lucide-react";

interface CancelOrderModalProps {
    onConfirm: () => void;
    onClose: () => void;
    isCancelling: boolean;
}

export function CancelOrderModal({ onConfirm, onClose, isCancelling }: CancelOrderModalProps) {
    return (
        <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { if (!isCancelling) onClose(); }}
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

            <div
                className="bg-[#0E0E13] border border-[#454932]/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-lg w-full max-w-[480px] flex flex-col overflow-hidden animate-slideUpCenter"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex flex-col items-center p-8 gap-6">
                    <div className="w-16 h-16 rounded-full bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#FF6B6B]" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-[#E4E1E9] font-bold text-2xl font-space">
                            Cancel this order?
                        </h3>
                        <p className="text-[#8F8389] text-sm font-space leading-relaxed max-w-[360px]">
                            This action will stop the current trade. You can only cancel while payment has not been marked as completed.
                        </p>
                    </div>

                    <div className="w-full flex flex-col gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isCancelling}
                            className="w-full bg-[#FF6B6B] hover:bg-[#ff5252] text-[#1B0505] font-bold text-lg py-4 rounded-lg shadow-[0_0_30px_rgba(255,107,107,0.15)] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-space"
                        >
                            {isCancelling ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                "Cancel Order"
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isCancelling}
                            className="w-full bg-[#2A292F] hover:bg-[#35343b] text-[#E4E1E9] font-bold text-base py-3.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-space"
                        >
                            Keep Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
