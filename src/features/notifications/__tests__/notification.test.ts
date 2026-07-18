import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React, { type ReactNode } from "react";
import {
  NotificationProvider,
  useNotificationContext,
} from "../context/NotificationContext";
import { useNotifications } from "../hooks/useNotifications";
import {
  isDuplicate,
  buildDedupeKey,
  enforceMaxNotifications,
} from "../utils/notification-deduplication";
import type { Notification } from "../types/notification.types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeNotification(overrides: Partial<Notification> = {}): Notification {
  return {
    id: "test-id",
    type: "info",
    title: "Test",
    createdAt: Date.now(),
    ...overrides,
  };
}

function wrapper({ children }: { children: ReactNode }) {
  return React.createElement(NotificationProvider, null, children);
}

// ---------------------------------------------------------------------------
// Deduplication utility tests
// ---------------------------------------------------------------------------

describe("notification-deduplication", () => {
  describe("isDuplicate()", () => {
    it("returns false when dedupeKey is undefined", () => {
      const queue = [makeNotification({ dedupeKey: "key-1" })];
      expect(isDuplicate(queue, undefined)).toBe(false);
    });

    it("returns false when queue is empty", () => {
      expect(isDuplicate([], "key-1")).toBe(false);
    });

    it("returns true when matching dedupeKey found", () => {
      const queue = [makeNotification({ dedupeKey: "escrow_funded:ord-123" })];
      expect(isDuplicate(queue, "escrow_funded:ord-123")).toBe(true);
    });

    it("returns false when dedupeKey does not match any item", () => {
      const queue = [makeNotification({ dedupeKey: "escrow_funded:ord-123" })];
      expect(isDuplicate(queue, "escrow_funded:ord-999")).toBe(false);
    });
  });

  describe("buildDedupeKey()", () => {
    it("returns eventType alone when no resourceId is given", () => {
      expect(buildDedupeKey("network_error")).toBe("network_error");
    });

    it("combines eventType and resourceId with a colon", () => {
      expect(buildDedupeKey("chat_message", "msg-42")).toBe(
        "chat_message:msg-42"
      );
    });
  });

  describe("enforceMaxNotifications()", () => {
    it("returns the same array unchanged when below the limit", () => {
      const queue = [makeNotification({ id: "a", createdAt: 1 })];
      const result = enforceMaxNotifications(queue, 5);
      expect(result).toHaveLength(1);
    });

    it("removes the oldest notification when at the limit", () => {
      const queue: Notification[] = [
        makeNotification({ id: "oldest", createdAt: 1 }),
        makeNotification({ id: "newer", createdAt: 2 }),
        makeNotification({ id: "newest", createdAt: 3 }),
      ];
      const result = enforceMaxNotifications(queue, 3);
      expect(result).toHaveLength(2);
      expect(result.find((n) => n.id === "oldest")).toBeUndefined();
    });

    it("does not mutate the original array", () => {
      const queue: Notification[] = [
        makeNotification({ id: "a", createdAt: 1 }),
        makeNotification({ id: "b", createdAt: 2 }),
      ];
      enforceMaxNotifications(queue, 2);
      expect(queue).toHaveLength(2);
    });
  });
});

// ---------------------------------------------------------------------------
// NotificationContext / useNotificationContext tests
// ---------------------------------------------------------------------------

describe("NotificationProvider + useNotificationContext", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it("starts with an empty notification queue", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });
    expect(result.current.notifications).toHaveLength(0);
  });

  it("adds a success notification", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    act(() => {
      result.current.notify({ type: "success", title: "Escrow funded" });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe("success");
    expect(result.current.notifications[0].title).toBe("Escrow funded");
  });

  it("adds an error notification", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    act(() => {
      result.current.notify({
        type: "error",
        title: "Transaction failed",
        message: "Please try again.",
      });
    });

    const n = result.current.notifications[0];
    expect(n.type).toBe("error");
    expect(n.title).toBe("Transaction failed");
    expect(n.message).toBe("Please try again.");
  });

  it("adds a warning notification", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });
    act(() => {
      result.current.notify({ type: "warning", title: "Wrong network" });
    });
    expect(result.current.notifications[0].type).toBe("warning");
  });

  it("adds an info notification", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });
    act(() => {
      result.current.notify({ type: "info", title: "New update available" });
    });
    expect(result.current.notifications[0].type).toBe("info");
  });

  it("auto-dismisses a notification after the configured duration", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    act(() => {
      result.current.notify({ type: "success", title: "Done", duration: 2000 });
    });
    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(2001);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it("manual dismiss removes the notification immediately", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    let id: string | null = null;
    act(() => {
      id = result.current.notify({ type: "info", title: "Manual dismiss me" });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.dismiss(id!);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it("dismissAll clears every notification", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    act(() => {
      result.current.notify({ type: "success", title: "A" });
      result.current.notify({ type: "error", title: "B" });
      result.current.notify({ type: "info", title: "C" });
    });

    expect(result.current.notifications).toHaveLength(3);

    act(() => {
      result.current.dismissAll();
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it("deduplicates notifications with the same dedupeKey", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    act(() => {
      result.current.notify({
        type: "info",
        title: "New message",
        dedupeKey: "chat_message:msg-1",
      });
      // Duplicate – should be ignored
      result.current.notify({
        type: "info",
        title: "New message",
        dedupeKey: "chat_message:msg-1",
      });
    });

    expect(result.current.notifications).toHaveLength(1);
  });

  it("allows notifications with different dedupeKeys", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    act(() => {
      result.current.notify({
        type: "info",
        title: "Msg 1",
        dedupeKey: "chat_message:msg-1",
      });
      result.current.notify({
        type: "info",
        title: "Msg 2",
        dedupeKey: "chat_message:msg-2",
      });
    });

    expect(result.current.notifications).toHaveLength(2);
  });

  it("limits visible notifications to MAX_NOTIFICATIONS (5)", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    act(() => {
      for (let i = 0; i < 7; i++) {
        result.current.notify({ type: "info", title: `Notification ${i}` });
      }
    });

    expect(result.current.notifications.length).toBeLessThanOrEqual(5);
  });

  it("returns null when a duplicate is suppressed", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    let id1: string | null = null;
    let id2: string | null = null;

    act(() => {
      id1 = result.current.notify({
        type: "info",
        title: "First",
        dedupeKey: "evt:1",
      });
      id2 = result.current.notify({
        type: "info",
        title: "Duplicate",
        dedupeKey: "evt:1",
      });
    });

    expect(id1).not.toBeNull();
    expect(id2).toBeNull();
  });

  it("handles missing title gracefully without throwing", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    expect(() => {
      act(() => {
        // @ts-expect-error intentionally passing empty title for error-handling test
        result.current.notify({ type: "info", title: "" });
      });
    }).not.toThrow();
  });

  it("handles invalid notification type gracefully", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    expect(() => {
      act(() => {
        // @ts-expect-error intentionally invalid type
        result.current.notify({ type: "purple", title: "Bad type" });
      });
    }).not.toThrow();

    // Falls back to 'info'
    expect(result.current.notifications[0].type).toBe("info");
  });

  it("stacks multiple distinct notifications correctly", () => {
    const { result } = renderHook(() => useNotificationContext(), { wrapper });

    act(() => {
      result.current.notify({ type: "success", title: "Done A" });
      result.current.notify({ type: "error", title: "Failed B" });
      result.current.notify({ type: "warning", title: "Watch C" });
    });

    expect(result.current.notifications).toHaveLength(3);
    expect(result.current.notifications.map((n) => n.type)).toEqual([
      "success",
      "error",
      "warning",
    ]);
  });
});

// ---------------------------------------------------------------------------
// useNotifications hook tests
// ---------------------------------------------------------------------------

describe("useNotifications", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it("notifySuccess creates a success toast", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.notifySuccess("Escrow funded", "The escrow was funded successfully.");
    });

    const n = result.current.notifications[0];
    expect(n.type).toBe("success");
    expect(n.title).toBe("Escrow funded");
    expect(n.message).toBe("The escrow was funded successfully.");
  });

  it("notifyError creates an error toast", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.notifyError("Transaction failed", "Please try again.");
    });

    const n = result.current.notifications[0];
    expect(n.type).toBe("error");
  });

  it("notifyWarning creates a warning toast", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.notifyWarning("Wrong Stellar network detected");
    });

    expect(result.current.notifications[0].type).toBe("warning");
  });

  it("notifyInfo creates an info toast", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.notifyInfo("Dispute opened successfully");
    });

    expect(result.current.notifications[0].type).toBe("info");
  });

  it("notifyEvent attaches a stable dedupeKey", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.notifyEvent("chat_message", {
        type: "info",
        title: "New message received",
        resourceId: "msg-42",
      });
    });

    expect(result.current.notifications[0].dedupeKey).toBe(
      "chat_message:msg-42"
    );
  });

  it("notifyEvent deduplicates real-time events", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.notifyEvent("escrow_funded", {
        type: "success",
        title: "Escrow funded",
        resourceId: "ord-123",
      });
      // Duplicate WebSocket event
      result.current.notifyEvent("escrow_funded", {
        type: "success",
        title: "Escrow funded",
        resourceId: "ord-123",
      });
    });

    expect(result.current.notifications).toHaveLength(1);
  });

  it("notifyEvent allows same event type for different resources", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.notifyEvent("escrow_funded", {
        type: "success",
        title: "Escrow A funded",
        resourceId: "ord-1",
      });
      result.current.notifyEvent("escrow_funded", {
        type: "success",
        title: "Escrow B funded",
        resourceId: "ord-2",
      });
    });

    expect(result.current.notifications).toHaveLength(2);
  });

  it("notify with action stores the action on the notification", () => {
    const { result } = renderHook(() => useNotifications(), { wrapper });

    act(() => {
      result.current.notify({
        type: "info",
        title: "New order",
        action: { label: "View order", href: "/p2p/orders/ord-99" },
      });
    });

    const n = result.current.notifications[0];
    expect(n.action?.label).toBe("View order");
    expect(n.action?.href).toBe("/p2p/orders/ord-99");
  });
});
