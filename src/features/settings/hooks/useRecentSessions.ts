"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useWalletContext } from "@/features/wallet/presentation/context/WalletContext";
import { securitySettingsService } from "../services/security-settings.service";
import type { UserSession } from "../types/security-settings.types";

function getBrowserAndDevice(): { device: string; browser: string } {
    if (typeof window === "undefined") {
        return { device: "Desktop", browser: "Web Browser" };
    }

    const ua = navigator.userAgent;
    let browser = "Web Browser";
    if (ua.includes("Firefox/")) browser = "Firefox";
    else if (ua.includes("Chrome/") && !ua.includes("Edg/")) browser = "Chrome";
    else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Edg/")) browser = "Edge";

    let device = "Desktop";
    if (/Android/i.test(ua)) device = "Android Device";
    else if (/iPhone|iPad|iPod/i.test(ua)) device = "iOS Device";
    else if (/Windows/i.test(ua)) device = "Windows PC";
    else if (/Macintosh/i.test(ua)) device = "macOS";
    else if (/Linux/i.test(ua)) device = "Linux PC";

    return { device, browser };
}

export function useRecentSessions() {
    const { accessToken, currentUser } = useUser();
    const { isConnected } = useWalletContext();

    const [sessions, setSessions] = useState<UserSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSessions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await securitySettingsService.getRecentSessions(accessToken);
            if (data.length > 0) {
                setSessions(data);
            } else if (isConnected || currentUser) {
                // If user is active/connected, generate current session indicator
                const { device, browser } = getBrowserAndDevice();
                const currentSession: UserSession = {
                    id: "current-session",
                    createdAt: new Date().toISOString(),
                    ipAddress: "Current Connection",
                    device: `${browser} on ${device}`,
                    browser,
                    isCurrent: true,
                    status: "active",
                };
                setSessions([currentSession]);
            } else {
                setSessions([]);
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to load recent sessions";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, currentUser, isConnected]);

    useEffect(() => {
        void loadSessions();
    }, [loadSessions]);

    return {
        sessions,
        isLoading,
        error,
        reload: loadSessions,
    };
}
