"use client";

import { useWallet } from "@/features/wallet/presentation/hooks/useWallet";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useUsers } from "@/features/user/hooks/useUsers";
import { useNotification } from "@/app/components/NotificationContext";
import { Copy, Eye, Shield, Clock, Monitor, CheckCircle2 } from "lucide-react";
import { useState } from "react";

function ConnectedWalletCard() {
    const { publicKey, isConnected } = useWallet();
    const [copied, setCopied] = useState(false);
    const [showFullAddress, setShowFullAddress] = useState(false);

    const handleCopy = async () => {
        if (publicKey) {
            await navigator.clipboard.writeText(publicKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    };

    return (
        <div className="overflow-hidden rounded-[22px] border border-[#1A1F26] bg-[linear-gradient(180deg,rgba(10,13,20,0.98)_0%,rgba(7,10,16,0.98)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <div className="border-b border-[#1A1F26] px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0F1A0C]">
                        <Shield className="h-6 w-6 text-[#BCED09]" />
                    </div>
                    <div>
                        <h3 className="text-[1.6rem] font-bold tracking-tight text-[#F8FAFC] sm:text-[1.9rem]">
                            Connected Wallet
                        </h3>
                        <p className="max-w-2xl text-sm leading-7 text-[#F8FAFC] sm:text-[15px]">
                            Your linked Stellar wallet address and connection status.
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-5 py-5 sm:px-7 sm:py-7">
                {isConnected && publicKey ? (
                    <div className="rounded-[18px] border border-[#171C24] bg-[#090D14]/88 p-4 sm:p-5">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-[#BCED09] animate-pulse" />
                                    <span className="text-sm font-semibold text-[#BCED09]">
                                        Connected
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowFullAddress(!showFullAddress)}
                                        className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#2A3342] bg-[#11151D] px-3 py-2 text-sm font-semibold text-[#F1F5F9] transition hover:border-[#BCED09] hover:text-white"
                                    >
                                        <Eye className="h-4 w-4" />
                                        {showFullAddress ? "Hide" : "Show"}
                                    </button>
                                    <button
                                        onClick={handleCopy}
                                        className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#2A3342] bg-[#11151D] px-3 py-2 text-sm font-semibold text-[#F1F5F9] transition hover:border-[#BCED09] hover:text-white"
                                    >
                                        <Copy className="h-4 w-4" />
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 rounded-[12px] border border-[#1A1F26] bg-[#05070C] px-4 py-4">
                                <code className="text-sm font-mono text-[#F1F5F9] break-all">
                                    {showFullAddress ? publicKey : shortenAddress(publicKey)}
                                </code>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-[18px] border border-[#171C24] bg-[#090D14]/88 p-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8F8389]/10">
                            <Shield className="h-8 w-8 text-[#8F8389]" />
                        </div>
                        <p className="text-sm leading-6 text-[#8F8389]">
                            No Stellar wallet is currently connected.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function SecurityPreferences() {
    const { currentUser } = useUser();
    const { updateUser } = useUsers();
    const { notify } = useNotification();
    const [loading, setLoading] = useState<string | null>(null);

    const preferences = [
        {
            id: "securityUpdates",
            label: "Security Updates",
            description: "Get notified about security updates and account changes.",
            value: currentUser?.securityUpdates ?? true,
        },
        {
            id: "notificationsEnabled",
            label: "Login Alerts",
            description: "Get notified when someone logs into your account.",
            value: currentUser?.notificationsEnabled ?? true,
        },
        {
            id: "emailNotifications",
            label: "Email Notifications",
            description: "Receive updates and announcements via email.",
            value: true,
        },
    ];

    const handleToggle = async (id: string, value: boolean) => {
        if (!currentUser) return;
        setLoading(id);
        try {
            await updateUser(currentUser.userId, { [id]: value });
            notify("success", "Preference updated successfully!");
        } catch {
            notify("error", "Failed to update preference.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="overflow-hidden rounded-[22px] border border-[#1A1F26] bg-[linear-gradient(180deg,rgba(10,13,20,0.98)_0%,rgba(7,10,16,0.98)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <div className="border-b border-[#1A1F26] px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0F1A0C]">
                        <CheckCircle2 className="h-6 w-6 text-[#BCED09]" />
                    </div>
                    <div>
                        <h3 className="text-[1.6rem] font-bold tracking-tight text-[#F8FAFC] sm:text-[1.9rem]">
                            Notification Preferences
                        </h3>
                        <p className="max-w-2xl text-sm leading-7 text-[#F8FAFC] sm:text-[15px]">
                            Manage your security and email notification settings.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-7 sm:py-7">
                {preferences.map((pref) => (
                    <div
                        key={pref.id}
                        className="flex flex-col gap-3 rounded-[18px] border border-[#171C24] bg-[#090D14]/88 p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-[#F8FAFC]">
                                {pref.label}
                            </p>
                            <p className="text-sm leading-7 text-[#8F8389]">
                                {pref.description}
                            </p>
                        </div>
                        <button
                            onClick={() => handleToggle(pref.id, !pref.value)}
                            disabled={loading === pref.id}
                            className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BCED09] focus-visible:ring-offset-2 focus-visible:ring-offset-[#010308] ${
                                pref.value
                                    ? "bg-[#BCED09]"
                                    : "bg-[#2A3342]"
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    pref.value
                                        ? "translate-x-6"
                                        : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RecentSessionsList() {
    // Mock session data
    const sessions = [
        {
            id: "1",
            date: new Date().toISOString(),
            ip: "192.0.2.1",
            device: "Chrome on Windows",
            location: "San Francisco, CA",
            status: "Current session",
        },
        {
            id: "2",
            date: new Date(Date.now() - 86400000).toISOString(),
            ip: "192.0.2.2",
            device: "Safari on macOS",
            location: "New York, NY",
            status: "Active",
        },
        {
            id: "3",
            date: new Date(Date.now() - 172800000).toISOString(),
            ip: "192.0.2.3",
            device: "Firefox on Linux",
            location: "London, UK",
            status: "Expired",
        },
    ];

    return (
        <div className="overflow-hidden rounded-[22px] border border-[#1A1F26] bg-[linear-gradient(180deg,rgba(10,13,20,0.98)_0%,rgba(7,10,16,0.98)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <div className="border-b border-[#1A1F26] px-5 py-5 sm:px-7 sm:py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#0F1A0C]">
                        <Clock className="h-6 w-6 text-[#BCED09]" />
                    </div>
                    <div>
                        <h3 className="text-[1.6rem] font-bold tracking-tight text-[#F8FAFC] sm:text-[1.9rem]">
                            Recent Sessions
                        </h3>
                        <p className="max-w-2xl text-sm leading-7 text-[#F8FAFC] sm:text-[15px]">
                            Review your recent login activity and active sessions.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 px-5 py-5 sm:px-7 sm:py-7">
                {sessions.length > 0 ? (
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`rounded-[18px] border p-4 sm:p-5 ${
                                session.status === "Current session"
                                    ? "border-[#2A3A1F] bg-[radial-gradient(circle_at_top,rgba(188,237,9,0.12),transparent_32%),#0F1A0C]"
                                    : "border-[#171C24] bg-[#090D14]/88"
                            }`}
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#11151D]">
                                        <Monitor className="h-5 w-5 text-[#8F8389]" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-[#F8FAFC]">
                                            {session.device}
                                        </p>
                                        <p className="text-sm leading-6 text-[#8F8389]">
                                            {new Date(session.date).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <p className="text-xs leading-5 text-[#516072]">
                                            IP: {session.ip} • {session.location}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                            session.status === "Current session"
                                                ? "bg-[#BCED09]/20 text-[#BCED09]"
                                                : session.status === "Active"
                                                ? "bg-[#3B82F6]/20 text-[#60A5FA]"
                                                : "bg-[#8F8389]/20 text-[#8F8389]"
                                        }`}
                                    >
                                        {session.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-[18px] border border-[#171C24] bg-[#090D14]/88 p-6 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8F8389]/10">
                            <Clock className="h-8 w-8 text-[#8F8389]" />
                        </div>
                        <p className="text-sm leading-6 text-[#8F8389]">
                            No recent session activity is available.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export function SecurityTab() {
    return (
        <div className="mx-auto w-full max-w-[1540px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="grid gap-6">
                <ConnectedWalletCard />
                <SecurityPreferences />
                <RecentSessionsList />
            </div>
        </div>
    );
}
