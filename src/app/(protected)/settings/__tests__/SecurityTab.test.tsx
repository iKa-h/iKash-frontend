import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SecurityTab } from "../components/SecurityTab";

vi.mock("@/features/settings/components/ConnectedWalletCard", () => ({
    ConnectedWalletCard: () => <div data-testid="connected-wallet-card">Connected Wallet Card</div>,
}));

vi.mock("@/features/settings/components/SecurityPreferences", () => ({
    SecurityPreferences: () => <div data-testid="security-preferences">Security Preferences</div>,
}));

vi.mock("@/features/settings/components/RecentSessionsList", () => ({
    RecentSessionsList: () => <div data-testid="recent-sessions-list">Recent Sessions List</div>,
}));

describe("SecurityTab", () => {
    it("renders all security sections", () => {
        render(<SecurityTab />);

        expect(screen.getByTestId("connected-wallet-card")).toBeInTheDocument();
        expect(screen.getByTestId("security-preferences")).toBeInTheDocument();
        expect(screen.getByTestId("recent-sessions-list")).toBeInTheDocument();
    });
});
