"use client";

import { ConnectedWalletCard } from "@/features/settings/components/ConnectedWalletCard";
import { SecurityPreferences } from "@/features/settings/components/SecurityPreferences";
import { RecentSessionsList } from "@/features/settings/components/RecentSessionsList";

export function SecurityTab() {
    return (
        <div className="mx-auto w-full max-w-[1540px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="space-y-6">
                <ConnectedWalletCard />
                <SecurityPreferences />
                <RecentSessionsList />
            </div>
        </div>
    );
}
