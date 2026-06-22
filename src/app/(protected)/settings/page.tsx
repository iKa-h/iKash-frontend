"use client";

import { useState } from "react";
import { Aside } from "../../components/Aside";
import { Header } from "../../components/Header";
import { ProfileTab } from "./components/ProfileTab";

const tabs = [
    { id: "profile", label: "Profile" },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="flex min-h-screen w-full bg-[#010308]">
            <Aside />
            <div className="flex flex-col flex-1 min-w-0">
                <Header title="SETTINGS" showUser={false} />
                
                {/* Navigation Tabs */}
                <div className="flex items-center gap-8 px-4 md:px-12 pt-6 bg-[#0A0D14]/30 border-b border-[#1A1F26]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 font-medium text-[16px] transition-colors cursor-pointer ${
                                activeTab === tab.id
                                    ? "text-[#BCED09] font-semibold border-b-2 border-[#BCED09]"
                                    : "text-[#8F8389] hover:text-white border-b-2 border-transparent"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content Area */}
                <main className="flex-1 overflow-y-auto">
                    {activeTab === "profile" && <ProfileTab />}
                    {activeTab === "wallets" && (
                        <div className="py-16 px-4 md:px-12 text-[#8F8389]">
                            Wallets settings configuration pending MVP integration.
                        </div>
                    )}
                    {activeTab === "payments" && (
                        <div className="py-16 px-4 md:px-12 text-[#8F8389]">
                            Payments settings configuration pending MVP integration.
                        </div>
                    )}
                    {activeTab === "security" && (
                        <div className="py-16 px-4 md:px-12 text-[#8F8389]">
                            Security settings configuration pending MVP integration.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
