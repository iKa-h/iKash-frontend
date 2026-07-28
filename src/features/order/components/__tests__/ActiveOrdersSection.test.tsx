import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActiveOrdersSection } from "../ActiveOrdersSection";
import { mockActiveOrders } from "../../mocks/active-orders.mock";

// Mock the ActiveOrderCard to keep tests focused on the section
vi.mock("../ActiveOrderCard", () => ({
    ActiveOrderCard: ({ order }: { order: (typeof mockActiveOrders)[number] }) => (
        <div data-testid="active-order-card" data-order-id={order.id}>
            {order.counterpartyName}
        </div>
    ),
}));

describe("ActiveOrdersSection", () => {
    it("renders exactly three mock order cards", () => {
        render(<ActiveOrdersSection />);
        const cards = screen.getAllByTestId("active-order-card");
        expect(cards).toHaveLength(3);
    });

    it("renders the section heading", () => {
        render(<ActiveOrdersSection />);
        expect(screen.getByRole("heading", { name: /active orders/i })).toBeDefined();
    });

    it("renders cards with distinct ids from the mock data", () => {
        render(<ActiveOrdersSection />);
        const cards = screen.getAllByTestId("active-order-card");
        const ids = cards.map((c) => c.getAttribute("data-order-id"));
        expect(ids).toEqual(["mock-order-1", "mock-order-2", "mock-order-3"]);
    });

    it("mock data contains exactly three entries", () => {
        expect(mockActiveOrders).toHaveLength(3);
    });

    it("each mock order has a unique id", () => {
        const ids = mockActiveOrders.map((o) => o.id);
        const unique = new Set(ids);
        expect(unique.size).toBe(3);
    });
});
