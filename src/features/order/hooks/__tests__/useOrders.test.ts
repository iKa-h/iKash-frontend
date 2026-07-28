import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOrders, ApiError } from "../useOrders";
import * as UserContextModule from "../../../user/presentation/context/UserContext";

vi.mock("../../../user/presentation/context/UserContext", () => ({
    useUser: vi.fn(),
}));

const mockedUseUser = vi.mocked(UserContextModule.useUser);

function mockFetchResponse(status: number, body: unknown) {
    return {
        ok: status >= 200 && status < 300,
        status,
        json: async () => body,
    } as Response;
}

describe("useOrders", () => {
    const logout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockedUseUser.mockReturnValue({
            accessToken: "test-token",
            logout,
        } as unknown as ReturnType<typeof UserContextModule.useUser>);
        vi.stubGlobal("fetch", vi.fn());
    });

    describe("cancelOrder", () => {
        it("calls POST /orders/:id/cancel with the auth header and returns the updated order", async () => {
            const updatedOrder = { orderId: "order-1", orderStatus: "cancelled" };
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockFetchResponse(200, updatedOrder),
            );

            const { result } = renderHook(() => useOrders());

            let response: unknown;
            await act(async () => {
                response = await result.current.cancelOrder("order-1");
            });

            expect(fetch).toHaveBeenCalledWith(
                expect.stringContaining("/orders/order-1/cancel"),
                expect.objectContaining({
                    method: "POST",
                    headers: expect.objectContaining({
                        Authorization: "Bearer test-token",
                    }),
                }),
            );
            expect(response).toEqual(updatedOrder);
            expect(result.current.order).toEqual(updatedOrder);
        });

        it("throws an ApiError carrying the HTTP status and backend error code on 409", async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockFetchResponse(409, {
                    statusCode: 409,
                    error: "ORDER_CANCELLATION_NOT_ALLOWED",
                    message: 'Order order-1 cannot be cancelled because it is already "released"',
                }),
            );

            const { result } = renderHook(() => useOrders());

            let caught: unknown;
            await act(async () => {
                try {
                    await result.current.cancelOrder("order-1");
                } catch (err) {
                    caught = err;
                }
            });

            expect(caught).toBeInstanceOf(ApiError);
            expect((caught as ApiError).status).toBe(409);
            expect((caught as ApiError).code).toBe("ORDER_CANCELLATION_NOT_ALLOWED");
        });

        it("throws an ApiError with status 403 when the user is not a participant", async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockFetchResponse(403, {
                    statusCode: 403,
                    error: "UNAUTHORIZED_ACTION",
                    message: "Only the buyer or seller on this order can cancel it",
                }),
            );

            const { result } = renderHook(() => useOrders());

            let caught: unknown;
            await act(async () => {
                try {
                    await result.current.cancelOrder("order-1");
                } catch (err) {
                    caught = err;
                }
            });

            expect(caught).toBeInstanceOf(ApiError);
            expect((caught as ApiError).status).toBe(403);
            expect((caught as ApiError).code).toBe("UNAUTHORIZED_ACTION");
        });

        it("logs the user out and throws on a 401", async () => {
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockFetchResponse(401, {}),
            );

            const { result } = renderHook(() => useOrders());

            await act(async () => {
                await expect(result.current.cancelOrder("order-1")).rejects.toThrow();
            });

            expect(logout).toHaveBeenCalledTimes(1);
        });

        it("omits the Authorization header when there is no access token", async () => {
            mockedUseUser.mockReturnValue({
                accessToken: null,
                logout,
            } as unknown as ReturnType<typeof UserContextModule.useUser>);
            (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
                mockFetchResponse(200, { orderId: "order-1", orderStatus: "cancelled" }),
            );

            const { result } = renderHook(() => useOrders());

            await act(async () => {
                await result.current.cancelOrder("order-1");
            });

            const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
            expect((options.headers as Record<string, string>).Authorization).toBeUndefined();
        });
    });
});