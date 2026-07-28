import { OfferFilters, SortOption, DEFAULT_FILTERS, FilterValidationErrors } from "../types/offer-filter.types";

/**
 * Converts active OfferFilters into a URLSearchParams-compatible record
 * for the /offers backend endpoint.
 *
 * IMPORTANT: Only send params the backend currently handles:
 *   - type     (offer_type enum: "buy" | "sell")
 *   - assetCode (e.g. "USDC", "XLM")
 *
 * paymentMethod, minAmount, maxAmount, and sort are NOT supported by the
 * backend yet — they are applied client-side in TradeDashboard instead.
 * Once the backend adds support, simply uncomment those lines here.
 */
export function buildOfferQuery(
    baseType: string,
    filters: OfferFilters
): Record<string, string> {
    const params: Record<string, string> = { type: baseType };

    // ✅ Supported by backend
    if (filters.asset) {
        params.assetCode = filters.asset;
    }

    // 🚧 Not yet supported by backend — handled client-side:
    // if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
    // if (filters.minAmount && parseFloat(filters.minAmount) > 0) params.minAmount = filters.minAmount;
    // if (filters.maxAmount && parseFloat(filters.maxAmount) > 0) params.maxAmount = filters.maxAmount;
    // if (filters.sort && filters.sort !== "best_match") params.sort = filters.sort;

    return params;
}

/**
 * Parses URL search params into an OfferFilters object,
 * falling back to defaults for missing or invalid values.
 */
export function parseFiltersFromURL(searchParams: URLSearchParams): OfferFilters {
    const VALID_SORTS: SortOption[] = [
        "best_match", "price_asc", "price_desc", "completion_rate_desc", "newest",
    ];

    const rawSort = searchParams.get("sort") ?? "";
    const sort: SortOption = VALID_SORTS.includes(rawSort as SortOption)
        ? (rawSort as SortOption)
        : DEFAULT_FILTERS.sort;

    const minAmount = searchParams.get("minAmount") ?? "";
    const maxAmount = searchParams.get("maxAmount") ?? "";

    // Reject negative or non-numeric values
    const sanitizeAmount = (v: string) => {
        if (v === "") return "";
        const n = parseFloat(v);
        return isNaN(n) || n < 0 ? "" : v;
    };

    return {
        paymentMethod: searchParams.get("paymentMethod") ?? DEFAULT_FILTERS.paymentMethod,
        asset: searchParams.get("asset") ?? DEFAULT_FILTERS.asset,
        minAmount: sanitizeAmount(minAmount),
        maxAmount: sanitizeAmount(maxAmount),
        sort,
    };
}

/**
 * Serialises OfferFilters into a URL search string (without leading "?").
 */
export function filtersToURLParams(filters: OfferFilters): string {
    const params = new URLSearchParams();
    if (filters.paymentMethod) params.set("paymentMethod", filters.paymentMethod);
    if (filters.asset) params.set("asset", filters.asset);
    if (filters.minAmount) params.set("minAmount", filters.minAmount);
    if (filters.maxAmount) params.set("maxAmount", filters.maxAmount);
    if (filters.sort !== "best_match") params.set("sort", filters.sort);
    return params.toString();
}

/**
 * Returns validation errors for the current filter values.
 */
export function validateFilters(filters: OfferFilters): FilterValidationErrors {
    const errors: FilterValidationErrors = {};

    const min = parseFloat(filters.minAmount);
    const max = parseFloat(filters.maxAmount);

    if (filters.minAmount !== "" && (isNaN(min) || min < 0)) {
        errors.minAmount = "Minimum amount must be a non-negative number.";
    }
    if (filters.maxAmount !== "" && (isNaN(max) || max < 0)) {
        errors.maxAmount = "Maximum amount must be a non-negative number.";
    }
    if (
        filters.minAmount !== "" &&
        filters.maxAmount !== "" &&
        !isNaN(min) &&
        !isNaN(max) &&
        min > max
    ) {
        errors.minAmount = "Minimum amount cannot exceed maximum amount.";
    }

    return errors;
}
