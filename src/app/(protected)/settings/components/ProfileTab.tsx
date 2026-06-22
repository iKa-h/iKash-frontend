"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, ShieldCheck, UserCheck, CheckCircle2, Clock3, Monitor, Smartphone, LogOut } from "lucide-react";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useUsers } from "@/features/user/hooks/useUsers";
import { useNotification } from "@/app/components/NotificationContext";

export function ProfileTab() {
    const { currentUser } = useUser();
    const { updateUser, checkAliasAvailable } = useUsers();
    const { notify } = useNotification();

    const [username, setUsername] = useState("");
    const [alias, setAlias] = useState("");
    const [aliasError, setAliasError] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [tradeAlerts, setTradeAlerts] = useState(true);
    const [securityUpdates, setSecurityUpdates] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [kycLoading, setKycLoading] = useState(false);
    const [kycError, setKycError] = useState<string | null>(null);

    // Refs for debouncing alias check and preventing race conditions
    const aliasDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const aliasRequestSeqRef = useRef(0);

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username || "");
            setAlias(currentUser.alias || "");
            setEmail(currentUser.email || "");
            setBio(currentUser.bio || "");
            setTradeAlerts(currentUser.notificationsEnabled ?? true);
            setSecurityUpdates(currentUser.securityUpdates ?? true);
        }
    }, [currentUser]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        
        if (alias && !/^[a-z0-9.!_]+$/.test(alias)) {
            setAliasError("Invalid format. Use lowercase, numbers, and ., !, _");
            return;
        }
        if (aliasError) return;

        setIsSaving(true);
        setSaveMessage("");
        
        try {
            const payload: any = {
                username,
                email,
                bio,
            };
            if (alias) {
                payload.alias = alias;
            }

            await updateUser(currentUser.userId, payload);
            setSaveMessage("Profile saved successfully!");
        } catch (err) {
            setSaveMessage("Error saving profile");
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(""), 3000);
        }
    };

    const handleAliasChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAlias(value);
        setAliasError("");

        // Cancel any pending debounced check
        if (aliasDebounceRef.current) {
            clearTimeout(aliasDebounceRef.current);
        }

        if (!value) return;

        const isValid = /^[a-z0-9.!_]+$/.test(value);
        if (!isValid) {
            setAliasError("Invalid format. Use lowercase, numbers, and ., !, _");
            return;
        }

        // Check availability only if value changed from the saved alias
        if (value !== currentUser?.alias) {
            // Debounce: wait 500 ms after the user stops typing
            aliasDebounceRef.current = setTimeout(async () => {
                // Capture a sequence number so stale responses are discarded
                aliasRequestSeqRef.current += 1;
                const seq = aliasRequestSeqRef.current;

                try {
                    const { available } = await checkAliasAvailable(value);

                    // Ignore if a newer request has already been issued
                    if (seq !== aliasRequestSeqRef.current) return;

                    if (!available) {
                        setAliasError("This alias is already taken.");
                    }
                } catch (err) {
                    if (seq !== aliasRequestSeqRef.current) return;
                    console.error("Failed to check alias", err);
                    notify(
                        "error",
                        "Could not verify alias availability. Please check your connection and try again."
                    );
                }
            }, 500);
        }
    }, [currentUser?.alias, checkAliasAvailable, notify]);

    const handleToggleTradeAlerts = async () => {
        if (!currentUser) return;
        const nextVal = !tradeAlerts;
        setTradeAlerts(nextVal);
        await updateUser(currentUser.userId, {
            notificationsEnabled: nextVal,
        });
    };

    const handleToggleSecurityUpdates = async () => {
        if (!currentUser) return;
        const nextVal = !securityUpdates;
        setSecurityUpdates(nextVal);
        await updateUser(currentUser.userId, {
            securityUpdates: nextVal,
        });
    };

    const handleStartKyc = async () => {
        if (!currentUser?.userId) return;
        setKycLoading(true);
        setKycError(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kyc/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: currentUser.userId }),
            });

            if (!res.ok) {
                throw new Error("Failed to initialize KYC verification");
            }

            const data = await res.json();
            if (data?.sessionUrl) {
                window.open(data.sessionUrl, "_blank", "noopener,noreferrer");
            } else {
                throw new Error("No verification URL returned");
            }
        } catch (err: any) {
            setKycError(err?.message || "Something went wrong starting KYC.");
        } finally {
            setKycLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 pt-8 px-12 pb-16 w-full max-w-[1632px]">
            {/* Left Column: Main Settings */}
            <div className="flex flex-col gap-8 flex-1 min-w-0 lg:max-w-[1035px]">
                {/* Profile Section */}
                <div className="bg-[#0A0D14] border border-[#1A1F26] rounded-2xl overflow-hidden shadow-md">
                    <div className="p-6 border-b border-[#1A1F26]">
                        <h3 className="text-[#F1F5F9] font-bold text-lg mb-1">
                            Profile Settings
                        </h3>
                        <p className="text-[#8F8389] text-sm">
                            Update your personal information and public profile.
                        </p>
                    </div>

                    <form onSubmit={handleSaveProfile} className="p-6 flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col flex-1 gap-2">
                                <label className="text-[#8F8389] text-sm font-medium">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter display name"
                                    className="bg-[#010308] border border-[#1A1F26] rounded-xl px-4 py-3 text-[#F1F5F9] focus:border-[#BCED09] outline-none transition-colors w-full"
                                />
                            </div>

                            <div className="flex flex-col flex-1 gap-2">
                                <label className="text-[#8F8389] text-sm font-medium">
                                    Account Alias
                                </label>
                                <input
                                    type="text"
                                    value={alias}
                                    onChange={handleAliasChange}
                                    placeholder="Enter unique alias"
                                    className={`bg-[#010308] border rounded-xl px-4 py-3 text-[#F1F5F9] focus:outline-none transition-colors w-full ${
                                        aliasError ? 'border-red-500 focus:border-red-500' : 'border-[#1A1F26] focus:border-[#BCED09]'
                                    }`}
                                />
                                {aliasError && (
                                    <span className="text-red-500 text-xs mt-1">{aliasError}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col flex-1 gap-2">
                                <label className="text-[#8F8389] text-sm font-medium">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    className="bg-[#010308] border border-[#1A1F26] rounded-xl px-4 py-3 text-[#F1F5F9] focus:border-[#BCED09] outline-none transition-colors w-full"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[#8F8389] text-sm font-medium">
                                Bio
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Write a short description about yourself..."
                                rows={3}
                                className="bg-[#010308] border border-[#1A1F26] rounded-xl px-4 py-3 text-[#F1F5F9] focus:border-[#BCED09] outline-none transition-colors resize-none w-full"
                            />
                        </div>

                        <div className="flex justify-end items-center gap-4 pt-2">
                            {saveMessage && (
                                <span className="text-[#BCED09] text-sm font-medium">
                                    {saveMessage}
                                </span>
                            )}
                            <button
                                type="submit"
                                disabled={isSaving || !!aliasError}
                                className="bg-[#BCED09] hover:bg-[#d4f53a] text-[#010308] font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Notifications Section
                <div className="bg-[#0A0D14] border border-[#1A1F26] rounded-2xl overflow-hidden shadow-md">
                    <div className="p-6 border-b border-[#1A1F26]">
                        <h3 className="text-[#F1F5F9] font-bold text-lg mb-1">
                            Notification Preferences
                        </h3>
                        <p className="text-[#8F8389] text-sm">
                            Control how and when you receive alerts from iKa$h.
                        </p>
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                        <div className="bg-[#010308]/50 border border-[#1A1F26] rounded-xl p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#BCED09]/10 flex items-center justify-center shrink-0">
                                    <Bell className="w-5 h-5 text-[#BCED09]" />
                                </div>
                                <div>
                                    <h4 className="text-[#F1F5F9] font-bold text-sm">
                                        Trade Alerts
                                    </h4>
                                    <p className="text-[#8F8389] text-xs mt-0.5">
                                        Receive notifications for market moves and order fills.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleTradeAlerts}
                                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ${
                                    tradeAlerts ? "bg-[#BCED09]" : "bg-[#374151]"
                                }`}
                            >
                                <div
                                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                                        tradeAlerts ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="bg-[#010308]/50 border border-[#1A1F26] rounded-xl p-4 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#BCED09]/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-[#BCED09]" />
                                </div>
                                <div>
                                    <h4 className="text-[#F1F5F9] font-bold text-sm">
                                        Security Updates
                                    </h4>
                                    <p className="text-[#8F8389] text-xs mt-0.5">
                                        Crucial alerts about login activity and security changes.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleToggleSecurityUpdates}
                                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ${
                                    securityUpdates ? "bg-[#BCED09]" : "bg-[#374151]"
                                }`}
                            >
                                <div
                                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                                        securityUpdates ? "translate-x-5" : "translate-x-0"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Right Column: Security Side Info */}
            <div className="flex flex-col gap-8 w-full lg:w-[501px] shrink-0">
                {/* KYC Verification Section */}
                <div className="bg-[#0A0D14] border border-[#1A1F26] rounded-2xl overflow-hidden shadow-md">
                    <div className="p-6 border-b border-[#1A1F26]">
                        <h3 className="text-[#F1F5F9] font-bold text-lg mb-1">
                            Identity Verification
                        </h3>
                        <p className="text-[#8F8389] text-sm">
                            Status of your account verification and KYC documents.
                        </p>
                    </div>

                    {currentUser?.kycStatus === "approved" ? (
                        <div className="p-6">
                            <div className="w-full bg-[#0F1A0C] border border-[#2A3A1F] rounded-3xl p-6 flex flex-col gap-6">
                                <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#bcf557]/30 bg-[#1A2D0F] px-4 py-2 text-[#BCED09]">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Account Verified</span>
                                </div>

                                <div className="flex flex-col gap-4 rounded-3xl bg-[#0A0E13] p-6 border border-[#1A1F26]">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-3xl bg-[#20301F] flex items-center justify-center text-[#BCED09]">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold text-base">
                                                KYC Tier 2 - Full Access
                                            </h4>
                                            <p className="text-[#8F8389] text-sm mt-2">
                                                Verified on{' '}
                                                {currentUser.kycUpdatedAt
                                                    ? new Date(currentUser.kycUpdatedAt).toLocaleDateString('en-US', {
                                                          month: 'long',
                                                          day: 'numeric',
                                                          year: 'numeric',
                                                      })
                                                    : 'the verified date'}
                                                . You have full access to all iKa$h features, including high-volume P2P trades and instant withdrawals.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full rounded-2xl border border-[#2F431F] bg-[#162915] px-5 py-3 text-sm font-semibold text-[#F7FFDF] transition hover:border-[#BCED09] hover:bg-[#1A2F10]"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="w-full bg-[#010308]/50 border border-[#1A1F26] rounded-2xl p-6 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-[#8F8389]/10 flex items-center justify-center mb-4">
                                    <UserCheck className="w-8 h-8 text-[#8F8389]" />
                                </div>

                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[#F1F5F9] font-bold text-base">
                                        Verification Status
                                    </span>
                                    <span className="bg-[#8F8389]/20 text-[#8F8389] text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider">
                                        {currentUser?.kycStatus || 'NOT VERIFIED'}
                                    </span>
                                </div>

                                <p className="text-[#8F8389] text-sm mb-6 max-w-[385px]">
                                    To ensure security and comply with regulations, please provide a valid government issued ID and a live selfie.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleStartKyc}
                                    disabled={kycLoading}
                                    className="w-full bg-[#BCED09] hover:bg-[#d4f53a] text-[#010308] font-bold text-sm py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    {kycLoading ? "Opening tab..." : "Verify Now"}
                                </button>
                                {kycError && (
                                    <p className="text-red-400 text-xs mt-2">{kycError}</p>
                                )}

                                <div className="flex items-center justify-center gap-6 mt-5 text-[#8F8389] text-xs">
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Secure</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock3 className="w-3.5 h-3.5" />
                                        <span>~5 mins</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section - Device Sessions 
                <div className="bg-[#0A0D14] border border-[#1A1F26] rounded-2xl overflow-hidden shadow-md">
                    <div className="p-6 border-b border-[#1A1F26] flex justify-between items-center">
                        <h3 className="text-[#F1F5F9] font-bold text-lg">
                            Device Sessions
                        </h3>
                        <button
                            type="button"
                            onClick={() => alert("All active sessions revoked.")}
                            className="text-[#BCED09] hover:underline text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                            Revoke All
                        </button>
                    </div>

                    <div className="flex flex-col">
                        
                        <div className="p-4 flex items-center justify-between border-b border-[#1A1F26] hover:bg-[#161618]/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#010308] border border-[#1A1F26] flex items-center justify-center text-[#F1F5F9] shrink-0">
                                    <Monitor className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#F1F5F9] font-bold text-sm">
                                        Chrome / MacBook Pro
                                    </span>
                                    <span className="text-[#8F8389] text-xs mt-0.5">
                                        London, UK • Current Session
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 flex items-center justify-between hover:bg-[#161618]/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#010308] border border-[#1A1F26] flex items-center justify-center text-[#F1F5F9] shrink-0">
                                    <Smartphone className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[#F1F5F9] font-bold text-sm">
                                        iKa$h App / iPhone 14
                                    </span>
                                    <span className="text-[#8F8389] text-xs mt-0.5">
                                        London, UK • 2 hours ago
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => alert("Session revoked.")}
                                className="text-[#8F8389] hover:text-white transition-colors cursor-pointer"
                                title="Revoke session"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-3 border-t border-[#1A1F26] text-center">
                        <button
                            type="button"
                            onClick={() => alert("Login history log opened.")}
                            className="text-[#8F8389] hover:text-white transition-colors text-xs font-medium cursor-pointer"
                        >
                            View Login History
                        </button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
