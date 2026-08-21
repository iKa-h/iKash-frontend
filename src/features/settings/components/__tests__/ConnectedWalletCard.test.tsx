import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConnectedWalletCard } from "../ConnectedWalletCard";
import * as walletContextModule from "@/features/wallet/presentation/context/WalletContext";

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
        } as any);

        render(<ConnectedWalletCard />);

        expect(screen.getByText("Not Connected")).toBeInTheDocument();
        expect(screen.getByText("No Stellar wallet is currently connected.")).toBeInTheDocument();
    });

    it("displays truncated address and allows toggling full address", () => {
        const fullKey = "GABC1234567890123456789012345678901234567890123456789012XYZ";
        vi.spyOn(walletContextModule, "useWalletContext").mockReturnValue({
            publicKey: fullKey,
            walletId: "freighter",
            isConnected: true,
        } as any);

        render(<ConnectedWalletCard />);

        expect(screen.getByText("Connected")).toBeInTheDocument();
        expect(screen.getByText("GABC12...012XYZ")).toBeInTheDocument();

        // Toggle full key
        const toggleBtn = screen.getByRole("button", { name: /view full address/i });
        fireEvent.click(toggleBtn);

        expect(screen.getByText(fullKey)).toBeInTheDocument();
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
        } as any);

        render(<ConnectedWalletCard />);

        const copyBtn = screen.getByRole("button", { name: /copy wallet address/i });
        fireEvent.click(copyBtn);

        expect(writeTextMock).toHaveBeenCalledWith(fullKey);
        expect(await screen.findByText("Copied")).toBeInTheDocument();
    });
});
