import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWalletNetwork } from "../useWalletNetwork";
import * as walletContextModule from "../../presentation/context/WalletContext";

vi.mock("../../presentation/context/WalletContext", () => ({
    useWalletContext: vi.fn(),
}));

describe("useWalletNetwork", () => {
    const mockCheckNetwork = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns network state and allows triggering checkNetwork", async () => {
        vi.spyOn(walletContextModule, "useWalletContext").mockReturnValue({
            expectedNetwork: "testnet",
            currentNetwork: "testnet",
            isCorrectNetwork: true,
            isCheckingNetwork: false,
            error: null,
            checkNetwork: mockCheckNetwork,
        } as any);

        const { result } = renderHook(() => useWalletNetwork());

        expect(result.current.expectedNetwork).toBe("testnet");
        expect(result.current.currentNetwork).toBe("testnet");
        expect(result.current.isCorrectNetwork).toBe(true);
        expect(result.current.isCheckingNetwork).toBe(false);

        await act(async () => {
            await result.current.checkNetwork();
        });

        expect(mockCheckNetwork).toHaveBeenCalledTimes(1);
    });
});
