import { describe, it, expect } from "vitest";
import {
    buildOfferQuery,
    parseFiltersFromURL,
    filtersToURLParams,
    validateFilters,
} from "@/features/offer/utils/build-offer-query";
import { DEFAULT_FILTERS, OfferFilters } from "@/features/offer/types/offer-filter.types";

// ---------------------------------------------------------------------------
// buildOfferQuery
// ---------------------------------------------------------------------------
describe("buildOfferQuery", () => {
    it("always includes the type param", () => {
        const result = buildOfferQuery("sell", DEFAULT_FILTERS);
        expect(result.type).toBe("sell");
    });

    it("only sends type when all other filters are default", () => {
        const result = buildOfferQuery("buy", DEFAULT_FILTERS);
        expect(result).toEqual({ type: "buy" });
    });

    it("sends assetCode when asset is set — backend supports this", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, asset: "USDC" };
        const result = buildOfferQuery("sell", filters);
        expect(result.assetCode).toBe("USDC");
    });

    it("does NOT send paymentMethod to the backend — handled client-side", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, paymentMethod: "SINPE" };
        const result = buildOfferQuery("sell", filters);
        expect(result.paymentMethod).toBeUndefined();
    });

    it("does NOT send minAmount to the backend — handled client-side", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, minAmount: "50" };
        const result = buildOfferQuery("sell", filters);
        expect(result.minAmount).toBeUndefined();
    });

    it("does NOT send maxAmount to the backend — handled client-side", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, maxAmount: "500" };
        const result = buildOfferQuery("sell", filters);
        expect(result.maxAmount).toBeUndefined();
    });

    it("does NOT send sort to the backend — handled client-side", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, sort: "price_asc" };
        const result = buildOfferQuery("sell", filters);
        expect(result.sort).toBeUndefined();
    });

    it("sends both type and assetCode when both are present", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, asset: "XLM" };
        const result = buildOfferQuery("buy", filters);
        expect(result).toEqual({ type: "buy", assetCode: "XLM" });
    });
});

// ---------------------------------------------------------------------------
// parseFiltersFromURL
// ---------------------------------------------------------------------------
describe("parseFiltersFromURL", () => {
    it("returns defaults for an empty search string", () => {
        const params = new URLSearchParams();
        expect(parseFiltersFromURL(params)).toEqual(DEFAULT_FILTERS);
    });

    it("parses valid sort values", () => {
        const params = new URLSearchParams("sort=price_desc");
        expect(parseFiltersFromURL(params).sort).toBe("price_desc");
    });

    it("falls back to best_match for unknown sort values", () => {
        const params = new URLSearchParams("sort=random_junk");
        expect(parseFiltersFromURL(params).sort).toBe("best_match");
    });

    it("parses paymentMethod and asset", () => {
        const params = new URLSearchParams("paymentMethod=PayPal&asset=XLM");
        const result = parseFiltersFromURL(params);
        expect(result.paymentMethod).toBe("PayPal");
        expect(result.asset).toBe("XLM");
    });

    it("sanitizes negative amounts to empty string", () => {
        const params = new URLSearchParams("minAmount=-10&maxAmount=-5");
        const result = parseFiltersFromURL(params);
        expect(result.minAmount).toBe("");
        expect(result.maxAmount).toBe("");
    });

    it("sanitizes non-numeric amounts to empty string", () => {
        const params = new URLSearchParams("minAmount=abc&maxAmount=xyz");
        const result = parseFiltersFromURL(params);
        expect(result.minAmount).toBe("");
        expect(result.maxAmount).toBe("");
    });

    it("preserves valid positive amounts", () => {
        const params = new URLSearchParams("minAmount=50&maxAmount=500");
        const result = parseFiltersFromURL(params);
        expect(result.minAmount).toBe("50");
        expect(result.maxAmount).toBe("500");
    });
});

// ---------------------------------------------------------------------------
// filtersToURLParams
// ---------------------------------------------------------------------------
describe("filtersToURLParams", () => {
    it("produces an empty string for default filters", () => {
        expect(filtersToURLParams(DEFAULT_FILTERS)).toBe("");
    });

    it("serializes active filters", () => {
        const filters: OfferFilters = {
            paymentMethod: "SINPE",
            asset: "USDC",
            minAmount: "50",
            maxAmount: "500",
            sort: "price_asc",
        };
        const result = filtersToURLParams(filters);
        const params = new URLSearchParams(result);
        expect(params.get("paymentMethod")).toBe("SINPE");
        expect(params.get("asset")).toBe("USDC");
        expect(params.get("minAmount")).toBe("50");
        expect(params.get("maxAmount")).toBe("500");
        expect(params.get("sort")).toBe("price_asc");
    });

    it("omits best_match sort from the URL", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, sort: "best_match" };
        const result = filtersToURLParams(filters);
        expect(new URLSearchParams(result).has("sort")).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// validateFilters
// ---------------------------------------------------------------------------
describe("validateFilters", () => {
    it("returns no errors for default filters", () => {
        expect(validateFilters(DEFAULT_FILTERS)).toEqual({});
    });

    it("errors when minAmount is negative", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, minAmount: "-1" };
        expect(validateFilters(filters).minAmount).toBeDefined();
    });

    it("errors when maxAmount is negative", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, maxAmount: "-5" };
        expect(validateFilters(filters).maxAmount).toBeDefined();
    });

    it("errors when minAmount exceeds maxAmount", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, minAmount: "500", maxAmount: "100" };
        expect(validateFilters(filters).minAmount).toBeDefined();
    });

    it("does not error when minAmount equals maxAmount", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, minAmount: "100", maxAmount: "100" };
        expect(validateFilters(filters)).toEqual({});
    });

    it("does not error when only minAmount is set", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, minAmount: "50" };
        expect(validateFilters(filters)).toEqual({});
    });

    it("does not error when only maxAmount is set", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, maxAmount: "500" };
        expect(validateFilters(filters)).toEqual({});
    });

    it("errors on non-numeric minAmount", () => {
        const filters: OfferFilters = { ...DEFAULT_FILTERS, minAmount: "abc" };
        expect(validateFilters(filters).minAmount).toBeDefined();
    });
});
