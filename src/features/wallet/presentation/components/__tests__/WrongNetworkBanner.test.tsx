import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WrongNetworkBanner } from "../WrongNetworkBanner";
import * as walletContextModule from "../../context/WalletContext";

vi.mock("../../context/WalletContext", () => ({
    useWalletContext: vi.fn(),
}));

describe("WrongNetworkBanner", () => {
    const mockCheckNetwork = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders nothing when wallet is not connected", () => {
        vi.spyOn(walletContextModule, "useWalletContext").mockReturnValue({
            isConnected: false,
            isCorrectNetwork: false,
            expectedNetwork: "testnet",
            currentNetwork: "mainnet",
            isCheckingNetwork: false,
            checkNetwork: mockCheckNetwork,
        } as any);

        const { container } = render(<WrongNetworkBanner />);
        expect(container.firstChild).toBeNull();
    });

    it("renders nothing when wallet is on the correct network", () => {
        vi.spyOn(walletContextModule, "useWalletContext").mockReturnValue({
            isConnected: true,
            isCorrectNetwork: true,
            expectedNetwork: "testnet",
            currentNetwork: "testnet",
            isCheckingNetwork: false,
            checkNetwork: mockCheckNetwork,
        } as any);

        const { container } = render(<WrongNetworkBanner />);
        expect(container.firstChild).toBeNull();
    });

    it("renders wrong network warning when wallet is on mainnet but testnet is required", () => {
        vi.spyOn(walletContextModule, "useWalletContext").mockReturnValue({
            isConnected: true,
            isCorrectNetwork: false,
            expectedNetwork: "testnet",
            currentNetwork: "mainnet",
            isCheckingNetwork: false,
            checkNetwork: mockCheckNetwork,
        } as any);

        render(<WrongNetworkBanner />);
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText("Wrong Stellar network detected")).toBeInTheDocument();
        expect(
            screen.getByText(/iKash is currently running on Testnet \(detected: Mainnet\)/)
        ).toBeInTheDocument();
    });

    it("renders unknown network warning when network cannot be determined", () => {
        vi.spyOn(walletContextModule, "useWalletContext").mockReturnValue({
            isConnected: true,
            isCorrectNetwork: false,
            expectedNetwork: "testnet",
            currentNetwork: "unknown",
            isCheckingNetwork: false,
            checkNetwork: mockCheckNetwork,
        } as any);

        render(<WrongNetworkBanner />);
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(
            screen.getByText("Unable to verify the wallet network")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Unable to verify the wallet network. Reconnect your wallet and try again.")
        ).toBeInTheDocument();
    });

    it("triggers checkNetwork when Recheck Network button is clicked", () => {
        vi.spyOn(walletContextModule, "useWalletContext").mockReturnValue({
            isConnected: true,
            isCorrectNetwork: false,
            expectedNetwork: "testnet",
            currentNetwork: "mainnet",
            isCheckingNetwork: false,
            checkNetwork: mockCheckNetwork,
        } as any);

        render(<WrongNetworkBanner />);
        const button = screen.getByRole("button", { name: /Recheck Network/i });
        fireEvent.click(button);
        expect(mockCheckNetwork).toHaveBeenCalledTimes(1);
    });
});
