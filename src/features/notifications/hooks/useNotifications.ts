import { useCallback } from "react";
import { useNotificationContext } from "../context/NotificationContext";
import type { NotificationAction, NotificationEventType, NotifyOptions } from "../types/notification.types";
import { buildDedupeKey } from "../utils/notification-deduplication";

/**
 * useNotifications
 *
 * The primary public API for triggering toast notifications from any feature.
 *
 * Usage:
 * ```tsx
 * const { notify, notifySuccess, notifyError, dismiss } = useNotifications();
 *
 * // Generic
 * notify({ type: 'success', title: 'Escrow funded', message: 'The escrow was funded successfully.' });
 *
 * // Convenience helpers
 * notifySuccess('Escrow funded', 'The escrow was funded successfully.');
 * notifyError('Transaction failed', 'Please try again.');
 *
 * // Real-time event helper (with automatic deduplication)
 * notifyEvent('escrow_funded', { title: 'Escrow funded', resourceId: orderId });
 * ```
 */
export function useNotifications() {
  const { notifications, notify, dismiss, dismissAll } = useNotificationContext();

  /** Trigger a notification using the full options object. */
  const notifyFull = useCallback(
    (options: NotifyOptions) => notify(options),
    [notify]
  );

  /** Show a success toast. */
  const notifySuccess = useCallback(
    (title: string, message?: string, action?: NotificationAction) =>
      notify({ type: "success", title, message, action }),
    [notify]
  );

  /** Show an error toast (stays visible longer by default). */
  const notifyError = useCallback(
    (title: string, message?: string, action?: NotificationAction) =>
      notify({ type: "error", title, message, action }),
    [notify]
  );

  /** Show a warning toast. */
  const notifyWarning = useCallback(
    (title: string, message?: string, action?: NotificationAction) =>
      notify({ type: "warning", title, message, action }),
    [notify]
  );

  /** Show an informational toast. */
  const notifyInfo = useCallback(
    (title: string, message?: string, action?: NotificationAction) =>
      notify({ type: "info", title, message, action }),
    [notify]
  );

  /**
   * Trigger a notification for a real-time event with automatic deduplication.
   *
   * @param eventType - Semantic event category (e.g. "escrow_funded")
   * @param options   - Notification content and optional resourceId used for
   *                    building a stable dedupeKey
   */
  const notifyEvent = useCallback(
    (
      eventType: NotificationEventType,
      options: Omit<NotifyOptions, "dedupeKey"> & { resourceId?: string }
    ) => {
      const { resourceId, ...rest } = options;
      const dedupeKey = buildDedupeKey(eventType, resourceId);
      return notify({ ...rest, dedupeKey });
    },
    [notify]
  );

  return {
    /** Current list of active notifications (read-only). */
    notifications,
    /** Full-options notify – mirrors the context API. */
    notify: notifyFull,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyEvent,
    /** Dismiss a specific notification by id. */
    dismiss,
    /** Dismiss all notifications. */
    dismissAll,
  };
}
