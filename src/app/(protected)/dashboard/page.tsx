"use client";

import { Aside } from "../../components/Aside";
import { Header } from "../../components/Header";
import { WalletDashboard } from "./components/WalletDashboard";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { Suspense } from "react";

export default function DashboardPage() {
    const { currentUser } = useUser();
    const displayName = currentUser?.alias || (currentUser?.publicKey ? `${currentUser.publicKey.slice(0, 6)}...` : "");

    return (
        <div className="flex min-h-screen w-full bg-[#010308]">
            <Aside />
            <div className="flex flex-col flex-1 min-w-0">
                <Header
                    description="account overview"
                    title="Welcome back,"
                    name={displayName}
                    mobileLabel="Welcome back"
                />
                <main className="flex items-start justify-between md:pl-12">
                    <Suspense fallback={
                        <div className="w-full flex items-center justify-center p-8">
                            <div className="w-8 h-8 border-4 border-[#BCED09] border-t-transparent rounded-full animate-spin" />
                        </div>
                    }>
                        <WalletDashboard />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}