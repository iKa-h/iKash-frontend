"use client";

/**
 * src/app/components/NotificationContext.tsx
 *
 * Legacy compatibility shim.
 *
 * This file re-exports the new global notification system so that any
 * existing code importing from this path continues to work without changes.
 *
 * The real implementation lives in:
 *   src/features/notifications/context/NotificationContext.tsx
 */

export {
  NotificationProvider,
  useNotificationContext,
} from "../../features/notifications/context/NotificationContext";

export { useNotifications } from "../../features/notifications/hooks/useNotifications";

// ---------------------------------------------------------------------------
// Legacy `useNotification` hook
//
// The original API was: notify(type, message, duration?)
// The new API is:       notify({ type, title, message?, duration? })
//
// This adapter bridges the two so call-sites that haven't migrated yet still
// work correctly.
// ---------------------------------------------------------------------------
import { useCallback } from "react";
import { useNotificationContext } from "../../features/notifications/context/NotificationContext";
import type { NotificationType } from "../../features/notifications/types/notification.types";

/**
 * @deprecated Use `useNotifications` from the features/notifications module
 *             for new code.
 */
export function useNotification() {
  const { notify } = useNotificationContext();

  const legacyNotify = useCallback(
    (type: NotificationType, message: string, duration?: number) => {
      notify({ type, title: message, duration });
    },
    [notify]
  );

  return { notify: legacyNotify };
}
