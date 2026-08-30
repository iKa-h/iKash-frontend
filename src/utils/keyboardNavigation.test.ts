import { describe, expect, it } from "vitest";
import { getRovingFocusIndex } from "./keyboardNavigation";

describe("getRovingFocusIndex", () => {
    it("moves and wraps horizontal focus", () => {
        expect(getRovingFocusIndex("ArrowRight", 1, 2, "horizontal")).toBe(0);
        expect(getRovingFocusIndex("ArrowLeft", 0, 2, "horizontal")).toBe(1);
    });

    it("moves and wraps vertical focus", () => {
        expect(getRovingFocusIndex("ArrowDown", 1, 2, "vertical")).toBe(0);
        expect(getRovingFocusIndex("ArrowUp", 0, 2, "vertical")).toBe(1);
    });

    it("supports Home and End in either orientation", () => {
        expect(getRovingFocusIndex("Home", 2, 4, "horizontal")).toBe(0);
        expect(getRovingFocusIndex("End", 0, 4, "vertical")).toBe(3);
    });

    it("ignores unrelated keys and empty collections", () => {
        expect(getRovingFocusIndex("Enter", 0, 2, "horizontal")).toBeNull();
        expect(getRovingFocusIndex("ArrowRight", 0, 0, "horizontal")).toBeNull();
    });
});
