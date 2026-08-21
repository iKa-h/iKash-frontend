"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useNotification } from "@/app/components/NotificationContext";
import { securitySettingsService } from "../services/security-settings.service";
import type { SecurityPreferences } from "../types/security-settings.types";

const INITIAL_PREFERENCES: SecurityPreferences = {
    securityUpdates: true,
    loginAlerts: true,
    transactionNotifications: true,
    escrowStatusUpdates: true,
    emailNotifications: false,
};

export function useSecuritySettings() {
    const { accessToken } = useUser();
    const { notify } = useNotification();

    const [preferences, setPreferences] = useState<SecurityPreferences>(INITIAL_PREFERENCES);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingKeys, setUpdatingKeys] = useState<Record<string, boolean>>({});

    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await securitySettingsService.getSecuritySettings(accessToken);
            setPreferences(data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to load security settings";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    useEffect(() => {
        void loadSettings();
    }, [loadSettings]);

    const updatePreference = useCallback(
        async (key: keyof SecurityPreferences, value: boolean) => {
            const previousValue = preferences[key];
            if (previousValue === value) return;

            // Optimistic update
            setPreferences((prev) => ({ ...prev, [key]: value }));
            setUpdatingKeys((prev) => ({ ...prev, [key]: true }));

            try {
                const updated = await securitySettingsService.updateSecuritySettings(
                    { [key]: value },
                    accessToken,
                );
                setPreferences(updated);
                notify("success", "Security preference updated.");
            } catch (err) {
                // Revert on failure
                setPreferences((prev) => ({ ...prev, [key]: previousValue }));
                const msg = err instanceof Error ? err.message : "Failed to update preference";
                notify("error", msg);
            } finally {
                setUpdatingKeys((prev) => {
                    const next = { ...prev };
                    delete next[key];
                    return next;
                });
            }
        },
        [preferences, accessToken, notify],
    );

    return {
        preferences,
        isLoading,
        error,
        updatingKeys,
        updatePreference,
        reload: loadSettings,
    };
}
