import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RecentSessionsList } from "../RecentSessionsList";
import * as sessionsHooksModule from "../../hooks/useRecentSessions";

vi.mock("../../hooks/useRecentSessions", () => ({
    useRecentSessions: vi.fn(),
}));

describe("RecentSessionsList", () => {
    const mockReload = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders empty state when there are no sessions", () => {
        vi.spyOn(sessionsHooksModule, "useRecentSessions").mockReturnValue({
            sessions: [],
            isLoading: false,
            error: null,
            reload: mockReload,
        });

        render(<RecentSessionsList />);

        expect(screen.getByText("No recent session activity is available.")).toBeTruthy();
    });

    it("renders sessions with current session badge clearly identified", () => {
        vi.spyOn(sessionsHooksModule, "useRecentSessions").mockReturnValue({
            sessions: [
                {
                    id: "session-1",
                    createdAt: "2026-07-14T09:30:00.000Z",
                    ipAddress: "192.0.2.1",
                    device: "Chrome on Windows",
                    isCurrent: true,
                    status: "active",
                },
                {
                    id: "session-2",
                    createdAt: "2026-07-10T14:20:00.000Z",
                    ipAddress: "198.51.100.42",
                    device: "Safari on iOS Device",
                    isCurrent: false,
                    status: "expired",
                },
            ],
            isLoading: false,
            error: null,
            reload: mockReload,
        });

        render(<RecentSessionsList />);

        expect(screen.getByText("Chrome on Windows")).toBeTruthy();
        expect(screen.getByText("Current session")).toBeTruthy();
        expect(screen.getByText("IP: 192.0.2.1")).toBeTruthy();

        expect(screen.getByText("Safari on iOS Device")).toBeTruthy();
        expect(screen.getByText("expired")).toBeTruthy();
        expect(screen.getByText("IP: 198.51.100.42")).toBeTruthy();
    });

    it("calls reload when Refresh button is clicked", () => {
        vi.spyOn(sessionsHooksModule, "useRecentSessions").mockReturnValue({
            sessions: [],
            isLoading: false,
            error: null,
            reload: mockReload,
        });

        render(<RecentSessionsList />);

        const refreshBtn = screen.getByRole("button", { name: /refresh recent sessions/i });
        fireEvent.click(refreshBtn);

        expect(mockReload).toHaveBeenCalledTimes(1);
    });
});
