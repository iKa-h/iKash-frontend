import { describe, it, expect } from "vitest";
import { canCancelOrder } from "../canCancelOrder";
import type { Order } from "../../models/order";

function makeOrder(overrides: Partial<Order> = {}): Order {
    return {
        orderId: "order-1",
        offerId: "offer-1",
        buyerId: "buyer-1",
        sellerId: "seller-1",
        assetAmount: "10",
        fiatAmount: "100",
        orderStatus: "created",
        expiresAt: null,
        escrow: null,
        ...overrides,
    };
}

describe("canCancelOrder", () => {
    it("allows cancellation for the buyer when there is no escrow yet", () => {
        const order = makeOrder();
        expect(canCancelOrder(order, "buyer-1")).toBe(true);
    });

    it("allows cancellation for the seller when there is no escrow yet", () => {
        const order = makeOrder();
        expect(canCancelOrder(order, "seller-1")).toBe(true);
    });

    it("denies cancellation for an unrelated user", () => {
        const order = makeOrder();
        expect(canCancelOrder(order, "stranger-1")).toBe(false);
    });

    it.each(["released", "cancelled", "expired", "disputed"] as const)(
        "denies cancellation when order status is already '%s'",
        (orderStatus) => {
            const order = makeOrder({ orderStatus });
            expect(canCancelOrder(order, "buyer-1")).toBe(false);
        },
    );

    it.each(["pending", "initialized"] as const)(
        "allows cancellation when escrow status is '%s'",
        (escrowStatus) => {
            const order = makeOrder({
                escrow: {
                    escrowId: "escrow-1",
                    orderId: "order-1",
                    escrowStatus,
                },
            });
            expect(canCancelOrder(order, "buyer-1")).toBe(true);
        },
    );

    it.each(["funded", "fiat_sent", "released", "disputed", "resolved"] as const)(
        "denies cancellation when escrow status is '%s'",
        (escrowStatus) => {
            const order = makeOrder({
                escrow: {
                    escrowId: "escrow-1",
                    orderId: "order-1",
                    escrowStatus,
                },
            });
            expect(canCancelOrder(order, "buyer-1")).toBe(false);
        },
    );
});
