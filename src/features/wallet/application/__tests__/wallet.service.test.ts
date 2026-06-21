import { describe, it, expect } from "vitest";
import { isSignatureCancelled } from "../wallet.service";

describe("isSignatureCancelled", () => {
    // --- Freighter rejection object (primary code-based detection) ---

    it("detects Freighter rejection via code -4", () => {
        const err = { code: -4, message: "The user rejected this request." };
        expect(isSignatureCancelled(err)).toBe(true);
    });

    it("detects Freighter rejection regardless of message text when code is -4", () => {
        const err = { code: -4, message: "Some other message without keywords" };
        expect(isSignatureCancelled(err)).toBe(true);
    });

    // --- Error instances (fallback message-based detection) ---

    it("detects Error with 'cancel' in message", () => {
        const err = new Error("User canceled the request");
        expect(isSignatureCancelled(err)).toBe(true);
    });

    it("detects Error with 'reject' in message", () => {
        const err = new Error("User rejected the request");
        expect(isSignatureCancelled(err)).toBe(true);
    });

    it("detects Error with 'declined' in message", () => {
        const err = new Error("User declined the request");
        expect(isSignatureCancelled(err)).toBe(true);
    });

    it("detects Error with mixed case", () => {
        const err = new Error("USER CANCELED");
        expect(isSignatureCancelled(err)).toBe(true);
    });

    // --- Plain objects (fallback message-based detection) ---

    it("detects plain object with cancel message (no code)", () => {
        const err = { message: "User canceled" };
        expect(isSignatureCancelled(err)).toBe(true);
    });

    it("detects plain object with reject message (no code)", () => {
        const err = { message: "user rejected" };
        expect(isSignatureCancelled(err)).toBe(true);
    });

    it("detects plain object with declined message (no code)", () => {
        const err = { message: "User declined" };
        expect(isSignatureCancelled(err)).toBe(true);
    });

    // --- False positives ---

    it("returns false for unrelated error with code !== -4", () => {
        const err = { code: 1, message: "Network error" };
        expect(isSignatureCancelled(err)).toBe(false);
    });

    it("returns false for unrelated Error", () => {
        const err = new Error("Network error");
        expect(isSignatureCancelled(err)).toBe(false);
    });

    it("returns false for a generic object", () => {
        const err = { foo: "bar" };
        expect(isSignatureCancelled(err)).toBe(false);
    });

    it("returns false for null", () => {
        expect(isSignatureCancelled(null)).toBe(false);
    });

    it("returns false for undefined", () => {
        expect(isSignatureCancelled(undefined)).toBe(false);
    });

    it("returns false for a string", () => {
        expect(isSignatureCancelled("cancel")).toBe(false);
    });

    it("returns false for a number", () => {
        expect(isSignatureCancelled(42)).toBe(false);
    });
});
