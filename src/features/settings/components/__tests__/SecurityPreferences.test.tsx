import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SecurityPreferences } from "../SecurityPreferences";
import * as securityHooksModule from "../../hooks/useSecuritySettings";

vi.mock("../../hooks/useSecuritySettings", () => ({
    useSecuritySettings: vi.fn(),
}));

describe("SecurityPreferences", () => {
    const mockUpdatePreference = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders all security preference toggles with their current state", () => {
        vi.spyOn(securityHooksModule, "useSecuritySettings").mockReturnValue({
            preferences: {
                securityUpdates: true,
                loginAlerts: true,
                transactionNotifications: false,
                escrowStatusUpdates: true,
                emailNotifications: false,
            },
            isLoading: false,
            error: null,
            updatingKeys: {},
            updatePreference: mockUpdatePreference,
            reload: vi.fn(),
        });

        render(<SecurityPreferences />);

        expect(screen.getByText("Security Updates")).toBeTruthy();
        expect(screen.getByText("Login Alerts")).toBeTruthy();
        expect(screen.getByText("Transaction Notifications")).toBeTruthy();
        expect(screen.getByText("Escrow Status Updates")).toBeTruthy();
        expect(screen.getByText("Email Notifications")).toBeTruthy();

        const securityUpdatesToggle = screen.getByRole("switch", { name: /toggle security updates/i });
        expect(securityUpdatesToggle.getAttribute("aria-checked")).toBe("true");

        const txToggle = screen.getByRole("switch", { name: /toggle transaction notifications/i });
        expect(txToggle.getAttribute("aria-checked")).toBe("false");
    });

    it("calls updatePreference when toggle is clicked", () => {
        vi.spyOn(securityHooksModule, "useSecuritySettings").mockReturnValue({
            preferences: {
                securityUpdates: true,
                loginAlerts: true,
                transactionNotifications: false,
                escrowStatusUpdates: true,
                emailNotifications: false,
            },
            isLoading: false,
            error: null,
            updatingKeys: {},
            updatePreference: mockUpdatePreference,
            reload: vi.fn(),
        });

        render(<SecurityPreferences />);

        const txToggle = screen.getByRole("switch", { name: /toggle transaction notifications/i });
        fireEvent.click(txToggle);

        expect(mockUpdatePreference).toHaveBeenCalledWith("transactionNotifications", true);
    });
});
