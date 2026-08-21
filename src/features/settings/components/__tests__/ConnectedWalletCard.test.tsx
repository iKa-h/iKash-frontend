import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConnectedWalletCard } from "../ConnectedWalletCard";
import * as walletContextModule from "@/features/wallet/presentation/context/WalletContext";
import type { WalletContext } from "@/features/wallet";

vi.mock("@/features/wallet/presentation/context/WalletContext", () => ({
    useWalletContext: vi.fn(),
}));

describe("ConnectedWalletCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("displays not connected message when wallet is disconnected", () => {
        vi.spyOn(walletContextModule, "useWalletContext").mockReturnValue({
            publicKey: null,
            walletId: null,
            isConnected: false,
        } as unknown as WalletContext);

        render(<ConnectedWalletCard />);

        expect(screen.getByText("Not Connected")).toBeTruthy();
        expect(screen.getByText("No Stellar wallet is currently connected.")).toBeTruthy();
    });

    it("displays truncated address and allows toggling full address", () => {
        const fullKey = "GABC1234567890123456789012345678901234567890123456789012XYZ";
        vi.spyOn(walletContextModule, "useWalletContext").mockReturnValue({
            publicKey: fullKey,
            walletId: "freighter",
            isConnected: true,
        } as unknown as WalletContext);

        render(<ConnectedWalletCard />);

        expect(screen.getByText("Connected")).toBeTruthy();
        expect(screen.getByText("GABC12...012XYZ")).toBeTruthy();

        // Toggle full key
        const toggleBtn = screen.getByRole("button", { name: /view full address/i });
        fireEvent.click(toggleBtn);

        expect(screen.getByText(fullKey)).toBeTruthy();
    });

    it("copies public key to clipboard when Copy button is clicked", async () => {
        const writeTextMock = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: {
                writeText: writeTextMock,
            },
        });

        const fullKey = "GABC1234567890123456789012345678901234567890123456789012XYZ";
        vi.spyOn(walletContextModule, "useWalletContext").mockReturnValue({
            publicKey: fullKey,
            walletId: "freighter",
            isConnected: true,
        } as unknown as WalletContext);

        render(<ConnectedWalletCard />);

        const copyBtn = screen.getByRole("button", { name: /copy wallet address/i });
        fireEvent.click(copyBtn);

        expect(writeTextMock).toHaveBeenCalledWith(fullKey);
        expect(await screen.findByText("Copied")).toBeTruthy();
    });
});
