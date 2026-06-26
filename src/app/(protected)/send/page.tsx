"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SendRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    useEffect(() => {
        const wallet = searchParams.get("wallet") || "";
        if (wallet) {
            router.replace(`/dashboard?send=true&wallet=${encodeURIComponent(wallet)}`);
        } else {
            router.replace("/dashboard?send=true");
        }
    }, [searchParams, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#010308]">
            <div className="w-8 h-8 border-4 border-[#BCED09] border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

export default function SendPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-[#010308]">
                <div className="w-8 h-8 border-4 border-[#BCED09] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SendRedirect />
        </Suspense>
    );
}
