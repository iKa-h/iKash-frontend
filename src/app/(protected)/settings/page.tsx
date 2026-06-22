"use client";

import { useState } from "react";
import { Aside } from "../../components/Aside";
import { Header } from "../../components/Header";
import { ProfileTab } from "./components/ProfileTab";

const tabs = [{ id: "profile", label: "Profile" }];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="flex min-h-screen w-full bg-[#010308]">
            <Aside />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header title="SETTINGS" showUser={false} />

                <div className="border-b border-[#1A1F26] bg-[#0A0D14]/30 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 pr-6 text-[15px] font-medium transition-colors cursor-pointer sm:text-[16px] ${
                                activeTab === tab.id
                                    ? "border-b-2 border-[#BCED09] font-semibold text-[#BCED09]"
                                    : "border-b-2 border-transparent text-[#8F8389] hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <main className="flex-1 overflow-y-auto">
                    {activeTab === "profile" && <ProfileTab />}
                    {activeTab === "wallets" && (
                        <div className="px-4 py-16 text-[#8F8389] md:px-12">
                            Wallets settings configuration pending MVP integration.
                        </div>
                    )}
                    {activeTab === "payments" && (
                        <div className="px-4 py-16 text-[#8F8389] md:px-12">
                            Payments settings configuration pending MVP integration.
                        </div>
                    )}
                    {activeTab === "security" && (
                        <div className="px-4 py-16 text-[#8F8389] md:px-12">
                            Security settings configuration pending MVP integration.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
