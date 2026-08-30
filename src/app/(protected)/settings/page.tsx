"use client";

import { useState } from "react";
import { Aside } from "../../components/Aside";
import { Header } from "../../components/Header";
import { ProfileTab } from "./components/ProfileTab";
import { getRovingFocusIndex } from "@/utils/keyboardNavigation";

const tabs = [{ id: "profile", label: "Profile" }];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        const nextIndex = getRovingFocusIndex(event.key, index, tabs.length, "horizontal");
        if (nextIndex === null) return;

        event.preventDefault();
        const nextTab = tabs[nextIndex];
        setActiveTab(nextTab.id);
        document.getElementById(`settings-tab-${nextTab.id}`)?.focus();
    };

    return (
        <div className="flex min-h-screen w-full bg-[#010308]">
            <Aside />
            <div className="flex min-w-0 flex-1 flex-col">
                <Header title="SETTINGS" showUser={false} />

                <div
                    role="tablist"
                    aria-label="Settings sections"
                    className="border-b border-[#1A1F26] bg-[#0A0D14]/30 px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6"
                >
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            id={`settings-tab-${tab.id}`}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-controls={`settings-panel-${tab.id}`}
                            tabIndex={activeTab === tab.id ? 0 : -1}
                            onClick={() => setActiveTab(tab.id)}
                            onKeyDown={(event) => handleTabKeyDown(event, index)}
                            className={`pb-4 pr-6 text-[15px] font-medium transition-colors cursor-pointer sm:text-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BCED09] focus-visible:ring-offset-2 focus-visible:ring-offset-[#010308] ${
                                activeTab === tab.id
                                    ? "border-b-2 border-[#BCED09] font-semibold text-[#BCED09]"
                                    : "border-b-2 border-transparent text-[#8F8389] hover:text-white"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <main
                    id={`settings-panel-${activeTab}`}
                    role="tabpanel"
                    aria-labelledby={`settings-tab-${activeTab}`}
                    tabIndex={0}
                    className="flex-1 overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#BCED09]"
                >
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
