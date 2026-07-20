"use client";

import { SORT_OPTIONS, SortOption } from "../types/offer-filter.types";

interface OfferSortSelectProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

export function OfferSortSelect({ value, onChange }: OfferSortSelectProps) {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#BCED09"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 6h18M7 12h10M11 18h2" />
                </svg>
            </div>
            <select
                id="offer-sort-select"
                value={value}
                onChange={(e) => onChange(e.target.value as SortOption)}
                className="appearance-none bg-[#161618] border border-[#2D2D2D] rounded-xl pl-9 pr-8 py-2.5
                           text-white text-sm font-medium cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-[#BCED09]/40 focus:border-[#BCED09]/60
                           hover:border-[#BCED09]/40 transition-colors duration-200
                           min-w-[200px]"
                aria-label="Sort offers"
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#161618]">
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </div>
        </div>
    );
}
