"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const OrderNavbar = () => {
    const pathname = usePathname();
    const isOrders = pathname === "/p2p/orders" || pathname.startsWith("/p2p/orders/");

    return (
        <div className="flex items-center gap-8 px-12 pt-6 bg-[#0A0D14]/30 border-b border-[#1A1F26] shrink-0">
            <Link
                href="/p2p"
                className={`pb-4 font-medium text-[14px] uppercase tracking-wider transition-colors cursor-pointer ${
                    !isOrders
                        ? "text-[#BCED09] font-bold border-b-2 border-[#BCED09]"
                        : "text-[#8F8389] hover:text-white border-b-2 border-transparent"
                }`}
            >
                Market
            </Link>
            <Link
                href="/p2p/orders"
                className={`pb-4 font-medium text-[14px] uppercase tracking-wider transition-colors cursor-pointer ${
                    isOrders
                        ? "text-[#BCED09] font-bold border-b-2 border-[#BCED09]"
                        : "text-[#8F8389] hover:text-white border-b-2 border-transparent"
                }`}
            >
                Orders
            </Link>
        </div>
    );
};
