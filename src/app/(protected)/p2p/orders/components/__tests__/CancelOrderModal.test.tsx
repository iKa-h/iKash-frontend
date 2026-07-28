import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CancelOrderModal } from "../CancelOrderModal";

describe("CancelOrderModal", () => {
    it("renders the confirmation copy and both actions", () => {
        render(
            <CancelOrderModal onConfirm={vi.fn()} onClose={vi.fn()} isCancelling={false} />,
        );

        expect(screen.getByText("Cancel this order?")).toBeTruthy();
        expect(screen.getByRole("button", { name: /cancel order/i })).toBeTruthy();
        expect(screen.getByRole("button", { name: /keep order/i })).toBeTruthy();
    });

    it("calls onConfirm when the Cancel Order button is clicked", () => {
        const onConfirm = vi.fn();
        render(
            <CancelOrderModal onConfirm={onConfirm} onClose={vi.fn()} isCancelling={false} />,
        );

        fireEvent.click(screen.getByRole("button", { name: /cancel order/i }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the Keep Order button is clicked", () => {
        const onClose = vi.fn();
        render(
            <CancelOrderModal onConfirm={vi.fn()} onClose={onClose} isCancelling={false} />,
        );

        fireEvent.click(screen.getByRole("button", { name: /keep order/i }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the backdrop is clicked", () => {
        const onClose = vi.fn();
        const { container } = render(
            <CancelOrderModal onConfirm={vi.fn()} onClose={onClose} isCancelling={false} />,
        );

        fireEvent.click(container.firstChild as Element);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("disables both actions and shows a loading label while cancelling", () => {
        render(
            <CancelOrderModal onConfirm={vi.fn()} onClose={vi.fn()} isCancelling={true} />,
        );

        expect(screen.getByText("Cancelling...")).toBeTruthy();
        const confirmButton = screen.getByRole("button", { name: /cancelling/i }) as HTMLButtonElement;
        const keepButton = screen.getByRole("button", { name: /keep order/i }) as HTMLButtonElement;
        expect(confirmButton.disabled).toBe(true);
        expect(keepButton.disabled).toBe(true);
    });

    it("does not close on backdrop click while cancelling", () => {
        const onClose = vi.fn();
        const { container } = render(
            <CancelOrderModal onConfirm={vi.fn()} onClose={onClose} isCancelling={true} />,
        );

        fireEvent.click(container.firstChild as Element);
        expect(onClose).not.toHaveBeenCalled();
    });

    it("does not call onClose when clicking inside the modal content", () => {
        const onClose = vi.fn();
        render(
            <CancelOrderModal onConfirm={vi.fn()} onClose={onClose} isCancelling={false} />,
        );

        fireEvent.click(screen.getByText("Cancel this order?"));
        expect(onClose).not.toHaveBeenCalled();
    });
});