import { Notification } from "../types/notification.types";

/**
 * Checks whether an incoming dedupeKey is already represented in the current
 * notifications queue.
 *
 * @param notifications - Currently active notifications
 * @param dedupeKey - The deduplication key of the incoming notification
 * @returns true when a duplicate exists and the incoming notification should
 *          be suppressed
 */
export function isDuplicate(
  notifications: Notification[],
  dedupeKey: string | undefined
): boolean {
  if (!dedupeKey) return false;
  return notifications.some((n) => n.dedupeKey === dedupeKey);
}

/**
 * Generates a stable deduplication key from an event type and an optional
 * resource identifier.
 *
 * Examples:
 *   buildDedupeKey("chat_message", "msg-123")   → "chat_message:msg-123"
 *   buildDedupeKey("escrow_funded", "ord-456")  → "escrow_funded:ord-456"
 *   buildDedupeKey("network_error")             → "network_error"
 *
 * @param eventType - The semantic event category
 * @param resourceId - An optional stable identifier for the affected resource
 */
export function buildDedupeKey(eventType: string, resourceId?: string): string {
  if (resourceId) return `${eventType}:${resourceId}`;
  return eventType;
}

/**
 * Enforces a hard cap on the notification queue.  When the queue already
 * contains `maxCount` items, the oldest notification (lowest `createdAt`) is
 * removed to make room for the new one.
 *
 * @param notifications - Current notification queue
 * @param maxCount - Maximum number of simultaneously visible toasts
 * @returns A new array with at most `maxCount - 1` items (the caller is
 *          expected to append the new notification afterwards)
 */
export function enforceMaxNotifications(
  notifications: Notification[],
  maxCount: number
): Notification[] {
  if (notifications.length < maxCount) return notifications;

  // Remove the oldest notification to make room
  const sorted = [...notifications].sort((a, b) => a.createdAt - b.createdAt);
  sorted.shift();
  return sorted;
}
