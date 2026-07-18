"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Notification,
  NotificationContextValue,
  NotifyOptions,
} from "../types/notification.types";
import { enforceMaxNotifications } from "../utils/notification-deduplication";

/** Maximum number of toasts visible at the same time. */
const MAX_NOTIFICATIONS = 5;

/** Default auto-dismiss durations per notification type (ms). */
const DEFAULT_DURATIONS: Record<string, number> = {
  success: 4000,
  info: 4000,
  warning: 5000,
  error: 7000,
};

export const NotificationContext = createContext<
  NotificationContextValue | undefined
>(undefined);

/**
 * NotificationProvider
 *
 * Mount this once at the application root.  It manages the notification queue
 * and exposes the context value to all children.
 */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Keep a ref to the latest notifications so that timeout callbacks always
  // see the up-to-date queue without stale closures.
  const notificationsRef = useRef<Notification[]>([]);
  notificationsRef.current = notifications;

  /**
   * A separate set of active dedupeKeys maintained synchronously on every
   * notify() call (and cleaned up on dismiss).  This is necessary because
   * React batches setState calls, so notificationsRef.current would not
   * reflect in-flight additions within the same synchronous call stack.
   */
  const activeDedupeKeysRef = useRef<Set<string>>(new Set());

  // Track active dismiss timers so we can cancel them on manual dismissal.
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  const dismiss = useCallback((id: string) => {
    // Cancel the auto-dismiss timer if still running
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setNotifications((prev) => {
      const removed = prev.find((n) => n.id === id);
      if (removed?.dedupeKey) {
        activeDedupeKeysRef.current.delete(removed.dedupeKey);
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  const dismissAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    activeDedupeKeysRef.current.clear();
    setNotifications([]);
  }, []);

  const notify = useCallback(
    (options: NotifyOptions): string | null => {
      try {
        const {
          type,
          title,
          message,
          action,
          dedupeKey,
          duration,
        } = options;

        // Validate required title – fall back gracefully
        const safeTitle = title?.trim() || "Notification";

        // Validate notification type
        const validTypes = ["success", "error", "warning", "info"] as const;
        const safeType = validTypes.includes(
          type as (typeof validTypes)[number]
        )
          ? type
          : "info";

        // Deduplication check: use the synchronous ref so batched React
        // updates within a single call-stack are handled correctly.
        if (dedupeKey && activeDedupeKeysRef.current.has(dedupeKey)) {
          return null;
        }

        const id = crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 11);

        const autoDismissMs =
          duration ?? DEFAULT_DURATIONS[safeType] ?? 4000;

        const notification: Notification = {
          id,
          type: safeType,
          title: safeTitle,
          message,
          duration: autoDismissMs,
          action,
          dedupeKey,
          createdAt: Date.now(),
        };

        // Register the dedupeKey synchronously before setState batching
        if (dedupeKey) {
          activeDedupeKeysRef.current.add(dedupeKey);
        }

        setNotifications((prev) => {
          const capped = enforceMaxNotifications(prev, MAX_NOTIFICATIONS);
          return [...capped, notification];
        });

        // Schedule auto-dismiss
        const timer = setTimeout(() => {
          timersRef.current.delete(id);
          if (dedupeKey) {
            activeDedupeKeysRef.current.delete(dedupeKey);
          }
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, autoDismissMs);

        timersRef.current.set(id, timer);

        return id;
      } catch (err) {
        // Notification failures must never crash the application
        console.error("[NotificationProvider] Failed to add notification:", err);
        return null;
      }
    },
    [] // no deps – uses refs for current state
  );

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss, dismissAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * useNotificationContext
 *
 * Low-level hook that returns the raw context value.
 * Prefer using `useNotifications` (the public hook) in feature code.
 */
export function useNotificationContext(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotificationContext must be used inside a <NotificationProvider>."
    );
  }
  return ctx;
}
