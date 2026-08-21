import { describe, it, expect, vi, beforeEach } from "vitest";
import { securitySettingsService } from "../security-settings.service";

describe("securitySettingsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches security settings with bearer token", async () => {
        const mockPrefs = {
            securityUpdates: true,
            loginAlerts: false,
            transactionNotifications: true,
            escrowStatusUpdates: true,
            emailNotifications: true,
        };

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: vi.fn().mockResolvedValueOnce(mockPrefs),
        } as any);

        const result = await securitySettingsService.getSecuritySettings("test-jwt");

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/users/me/security-settings"),
            expect.objectContaining({
                method: "GET",
                headers: { Authorization: "Bearer test-jwt" },
            }),
        );
        expect(result.loginAlerts).toBe(false);
        expect(result.emailNotifications).toBe(true);
    });

    it("patches security settings", async () => {
        const updatedPrefs = {
            securityUpdates: true,
            loginAlerts: true,
            transactionNotifications: true,
            escrowStatusUpdates: true,
            emailNotifications: true,
        };

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: vi.fn().mockResolvedValueOnce(updatedPrefs),
        } as any);

        const result = await securitySettingsService.updateSecuritySettings(
            { emailNotifications: true },
            "test-jwt",
        );

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/users/me/security-settings"),
            expect.objectContaining({
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer test-jwt",
                },
                body: JSON.stringify({ emailNotifications: true }),
            }),
        );
        expect(result.emailNotifications).toBe(true);
    });

    it("fetches recent sessions", async () => {
        const mockSessions = [
            {
                id: "s1",
                createdAt: "2026-07-14T09:30:00Z",
                ipAddress: "192.0.2.1",
                device: "Chrome on Windows",
                isCurrent: true,
                status: "active",
            },
        ];

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: vi.fn().mockResolvedValueOnce(mockSessions),
        } as any);

        const result = await securitySettingsService.getRecentSessions("test-jwt");

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/users/me/sessions"),
            expect.objectContaining({
                method: "GET",
                headers: { Authorization: "Bearer test-jwt" },
            }),
        );
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("s1");
    });
});
