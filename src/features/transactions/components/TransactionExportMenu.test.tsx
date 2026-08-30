import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TransactionExportMenu } from "./TransactionExportMenu";

describe("TransactionExportMenu keyboard navigation", () => {
    beforeEach(() => {
        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => (
            window.setTimeout(() => callback(performance.now()), 0)
        ));
    });

    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
    });

    it("opens with ArrowDown and exposes menu semantics", async () => {
        render(<TransactionExportMenu onExport={vi.fn()} />);
        const trigger = screen.getByRole("button", { name: /export history/i });

        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        fireEvent.keyDown(trigger, { key: "ArrowDown" });

        const items = screen.getAllByRole("menuitem");
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(items).toHaveLength(2);
        await waitFor(() => expect(document.activeElement).toBe(items[0]));
    });

    it("moves through items with arrows, Home, and End", async () => {
        render(<TransactionExportMenu onExport={vi.fn()} />);
        const trigger = screen.getByRole("button", { name: /export history/i });
        fireEvent.keyDown(trigger, { key: "ArrowDown" });
        const items = screen.getAllByRole("menuitem");
        await waitFor(() => expect(document.activeElement).toBe(items[0]));

        fireEvent.keyDown(items[0], { key: "ArrowDown" });
        expect(document.activeElement).toBe(items[1]);
        fireEvent.keyDown(items[1], { key: "Home" });
        expect(document.activeElement).toBe(items[0]);
        fireEvent.keyDown(items[0], { key: "End" });
        expect(document.activeElement).toBe(items[1]);
    });

    it("closes on Escape and restores trigger focus", async () => {
        render(<TransactionExportMenu onExport={vi.fn()} />);
        const trigger = screen.getByRole("button", { name: /export history/i });
        fireEvent.keyDown(trigger, { key: "ArrowDown" });
        const firstItem = screen.getAllByRole("menuitem")[0];
        await waitFor(() => expect(document.activeElement).toBe(firstItem));

        fireEvent.keyDown(firstItem, { key: "Escape" });

        expect(screen.queryByRole("menu")).toBeNull();
        await waitFor(() => expect(document.activeElement).toBe(trigger));
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });
});
