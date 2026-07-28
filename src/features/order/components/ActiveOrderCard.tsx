"use client";

import Image from "next/image";
import { Landmark } from "lucide-react";
import { ActiveOrderMock } from "../mocks/active-orders.mock";

function getRelativeTime(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
}

interface ActiveOrderCardProps {
    order: ActiveOrderMock;
}

// Status pill: border colored, text white (per reviewer feedback)
const STATUS_BORDER: Record<string, string> = {
    FUNDING:     "border-[#BCED09]",
    PENDING:     "border-yellow-400",
    IN_PROGRESS: "border-blue-400",
    // COMPLETED intentionally omitted — completed orders do not appear in the active section
};

export function ActiveOrderCard({ order }: ActiveOrderCardProps) {
    const displayTime = getRelativeTime(order.updatedAt);
    const statusBorder = STATUS_BORDER[order.status] ?? "border-[#8F8389]";

    return (
        <div
            className="flex flex-col rounded-2xl bg-[#121214] border border-[#1f1f1f] overflow-hidden
                       min-w-[260px] w-full transition-all duration-200 hover:border-[#2a2a2a] hover:bg-[#151517]"
            data-testid="active-order-card"
        >
            {/* Top section — 24px gap and padding per Figma */}
            <div className="flex flex-col gap-6 p-6">
                {/* Role + Status row */}
                <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-[0.15em] text-[#8F8389] uppercase">
                        {order.role}
                    </span>
                    {/* Border colored, text white */}
                    <span
                        className={`text-[11px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full border text-white ${statusBorder}`}
                    >
                        {order.status}
                    </span>
                </div>

                {/* Amount + Asset row — asset icon aligned to the right */}
                <div className="flex items-center justify-between">
                    <span className="text-[32px] font-bold text-white tracking-tight leading-none">
                        {order.assetAmount}
                    </span>
                    <div className="flex items-center gap-2">
                        {/* USDC icon loaded from public assets */}
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                            <Image
                                src="/usdc.png"
                                alt="USDC"
                                width={28}
                                height={28}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-[13px] font-semibold text-[#c0c0c0] tracking-wider">
                            {order.assetCode}
                        </span>
                    </div>
                </div>

                {/* Payment method — Landmark icon from lucide-react */}
                <div className="flex items-center gap-2">
                    <Landmark size={16} className="text-[#8F8389] shrink-0" />
                    <span className="text-[13px] text-[#8F8389]">{order.paymentMethod}</span>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#1f1f1f] mx-6" />

            {/* Bottom section — 24px gap and padding per Figma */}
            <div className="flex flex-col gap-6 p-6">
                {/* Counterparty — profile image pattern from P2P panel */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] shrink-0 overflow-hidden">
                        {order.counterpartyProfileImageUrl ? (
                            <Image
                                src={order.counterpartyProfileImageUrl}
                                alt={order.counterpartyName || "Counterparty profile image"}
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                            />
                        ) : null}
                    </div>
                    <div>
                        <p className="text-[13px] font-semibold text-white leading-tight">
                            {order.counterpartyName}
                        </p>
                        <p className="text-[11px] text-[#8F8389] leading-tight">
                            Unit price&nbsp;
                            <span className="font-bold text-[#c0c0c0]">
                                {order.unitPrice} {order.fiatCurrency}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Time + Open button — items aligned at bottom */}
                <div className="flex items-end justify-between">
                    <span className="text-[12px] text-[#8F8389]">{displayTime}</span>
                    {/* Open button — disabled for mock orders to prevent invalid navigation */}
                    <button
                        disabled
                        title="Available once backend integration is enabled"
                        className="px-5 py-2 rounded-full bg-[#BCED09] text-black text-[13px] font-bold
                                   tracking-wide cursor-not-allowed opacity-90 transition-all duration-150
                                   hover:opacity-100"
                    >
                        Open
                    </button>
                </div>
            </div>
        </div>
    );
}
