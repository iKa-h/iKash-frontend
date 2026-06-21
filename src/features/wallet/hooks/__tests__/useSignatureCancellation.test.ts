import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSignatureCancellation } from "../useSignatureCancellation";
import * as walletServiceModule from "../../application/wallet.service";

vi.mock("../../application/wallet.service", () => ({
    walletService: {
        signTransaction: vi.fn(),
    },
    isSignatureCancelled: vi.fn(),
}));

const mockedWalletService = vi.mocked(walletServiceModule.walletService);
const mockedIsSignatureCancelled = vi.mocked(walletServiceModule.isSignatureCancelled);

describe("useSignatureCancellation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("starts with no pending XDR, modal hidden, not signing", () => {
        const { result } = renderHook(() => useSignatureCancellation());

        expect(result.current.pendingXdr).toBeNull();
        expect(result.current.showModal).toBe(false);
        expect(result.current.isSigning).toBe(false);
    });

    describe("sign()", () => {
        it("returns signed XDR on success", async () => {
            const fakeSigned = "AAAA...signed";
            mockedWalletService.signTransaction.mockResolvedValueOnce(fakeSigned);

            const { result } = renderHook(() => useSignatureCancellation());

            let signed: string;
            await act(async () => {
                signed = await result.current.sign("AAAA...unsigned");
            });

            expect(signed!).toBe(fakeSigned);
            expect(result.current.showModal).toBe(false);
            expect(result.current.pendingXdr).toBeNull();
        });

        it("sets pending XDR and shows modal on cancellation", async () => {
            const rejectErr = { code: -4, message: "User rejected" };
            mockedWalletService.signTransaction.mockRejectedValueOnce(rejectErr);
            mockedIsSignatureCancelled.mockReturnValueOnce(true);

            const { result } = renderHook(() => useSignatureCancellation());

            await act(async () => {
                await expect(result.current.sign("AAAA...unsigned")).rejects.toBe(rejectErr);
            });

            expect(result.current.pendingXdr).toBe("AAAA...unsigned");
            expect(result.current.showModal).toBe(true);
        });

        it("does not set pending state on non-cancellation error", async () => {
            const networkErr = new Error("Network error");
            mockedWalletService.signTransaction.mockRejectedValueOnce(networkErr);
            mockedIsSignatureCancelled.mockReturnValueOnce(false);

            const { result } = renderHook(() => useSignatureCancellation());

            await act(async () => {
                await expect(result.current.sign("AAAA...unsigned")).rejects.toThrow("Network error");
            });

            expect(result.current.pendingXdr).toBeNull();
            expect(result.current.showModal).toBe(false);
        });

        it("sets isSigning during sign operation", async () => {
            let resolveSign!: (value: string) => void;
            const signPromise = new Promise<string>((resolve) => {
                resolveSign = resolve;
            });
            mockedWalletService.signTransaction.mockReturnValueOnce(signPromise);

            const { result } = renderHook(() => useSignatureCancellation());

            let signPromiseOut: Promise<string>;
            act(() => {
                signPromiseOut = result.current.sign("AAAA...unsigned");
            });

            // React should have flushed the isSigning update
            await waitFor(() => {
                expect(result.current.isSigning).toBe(true);
            });

            await act(async () => {
                resolveSign("AAAA...signed");
                await signPromiseOut!;
            });

            expect(result.current.isSigning).toBe(false);
        });
    });

    describe("retry()", () => {
        it("succeeds and clears pending state", async () => {
            const fakeSigned = "AAAA...signed";
            const rejectErr = { code: -4, message: "User rejected" };

            mockedWalletService.signTransaction
                .mockRejectedValueOnce(rejectErr)
                .mockResolvedValueOnce(fakeSigned);
            mockedIsSignatureCancelled.mockReturnValueOnce(true);

            const { result } = renderHook(() => useSignatureCancellation());

            await act(async () => {
                await expect(result.current.sign("AAAA...unsigned")).rejects.toBe(rejectErr);
            });

            expect(result.current.showModal).toBe(true);
            expect(result.current.pendingXdr).toBe("AAAA...unsigned");

            let signed: string;
            await act(async () => {
                signed = await result.current.retry();
            });

            expect(signed!).toBe(fakeSigned);
            expect(result.current.showModal).toBe(false);
            expect(result.current.pendingXdr).toBeNull();
        });

        it("re-shows modal on second cancellation", async () => {
            const rejectErr = { code: -4, message: "User rejected" };

            mockedWalletService.signTransaction
                .mockRejectedValueOnce(rejectErr)
                .mockRejectedValueOnce(rejectErr);
            mockedIsSignatureCancelled.mockReturnValue(true);

            const { result } = renderHook(() => useSignatureCancellation());

            await act(async () => {
                await expect(result.current.sign("AAAA...unsigned")).rejects.toBe(rejectErr);
            });
            expect(result.current.showModal).toBe(true);

            await act(async () => {
                await expect(result.current.retry()).rejects.toBe(rejectErr);
            });
            expect(result.current.showModal).toBe(true);
            expect(result.current.pendingXdr).toBe("AAAA...unsigned");
        });

        it("clears pending state on non-cancellation error", async () => {
            const rejectErr = { code: -4, message: "User rejected" };
            const networkErr = new Error("Network error");

            mockedWalletService.signTransaction
                .mockRejectedValueOnce(rejectErr)
                .mockRejectedValueOnce(networkErr);
            mockedIsSignatureCancelled
                .mockReturnValueOnce(true)
                .mockReturnValueOnce(false);

            const { result } = renderHook(() => useSignatureCancellation());

            await act(async () => {
                await expect(result.current.sign("AAAA...unsigned")).rejects.toBe(rejectErr);
            });
            expect(result.current.pendingXdr).toBe("AAAA...unsigned");

            await act(async () => {
                await expect(result.current.retry()).rejects.toThrow("Network error");
            });
            expect(result.current.pendingXdr).toBeNull();
            expect(result.current.showModal).toBe(false);
        });

        it("supports multiple consecutive cancel-then-retry cycles", async () => {
            const rejectErr = { code: -4, message: "User rejected" };
            const fakeSigned = "AAAA...signed";

            mockedWalletService.signTransaction
                .mockRejectedValueOnce(rejectErr)  // 1st sign -> cancel
                .mockRejectedValueOnce(rejectErr)  // 1st retry -> cancel
                .mockResolvedValueOnce(fakeSigned); // 2nd retry -> success
            mockedIsSignatureCancelled.mockReturnValue(true);

            const { result } = renderHook(() => useSignatureCancellation());

            // Cycle 1: sign -> cancel
            await act(async () => {
                await expect(result.current.sign("AAAA...unsigned")).rejects.toBe(rejectErr);
            });
            expect(result.current.showModal).toBe(true);
            expect(result.current.pendingXdr).toBe("AAAA...unsigned");

            // Cycle 2: retry -> cancel (1st retry)
            await act(async () => {
                await expect(result.current.retry()).rejects.toBe(rejectErr);
            });
            expect(result.current.showModal).toBe(true);
            expect(result.current.pendingXdr).toBe("AAAA...unsigned");

            // Cycle 3: retry -> success (2nd retry)
            let signed: string;
            await act(async () => {
                signed = await result.current.retry();
            });
            expect(signed!).toBe(fakeSigned);
            expect(result.current.showModal).toBe(false);
            expect(result.current.pendingXdr).toBeNull();
        });

        it("throws if no pending XDR", async () => {
            const { result } = renderHook(() => useSignatureCancellation());

            await act(async () => {
                await expect(result.current.retry()).rejects.toThrow("No pending XDR to retry");
            });
        });
    });

    describe("cancel()", () => {
        it("clears pending XDR and hides modal", () => {
            const { result } = renderHook(() => useSignatureCancellation());

            act(() => {
                result.current.cancel();
            });

            expect(result.current.pendingXdr).toBeNull();
            expect(result.current.showModal).toBe(false);
        });

        it("works after a failed sign", async () => {
            const rejectErr = { code: -4, message: "User rejected" };
            mockedWalletService.signTransaction.mockRejectedValueOnce(rejectErr);
            mockedIsSignatureCancelled.mockReturnValueOnce(true);

            const { result } = renderHook(() => useSignatureCancellation());

            await act(async () => {
                await expect(result.current.sign("AAAA...unsigned")).rejects.toBe(rejectErr);
            });
            expect(result.current.showModal).toBe(true);

            act(() => {
                result.current.cancel();
            });

            expect(result.current.pendingXdr).toBeNull();
            expect(result.current.showModal).toBe(false);
        });
    });
});
