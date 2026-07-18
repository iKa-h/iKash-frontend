// Notification variant types
export type NotificationType = "success" | "error" | "warning" | "info";

// Real-time event types that can trigger notifications
export type NotificationEventType =
  | "chat_message"
  | "escrow_funded"
  | "escrow_released"
  | "escrow_refunded"
  | "order_expired"
  | "dispute_opened"
  | "dispute_resolved"
  | "transaction_success"
  | "transaction_failed"
  | "payment_method_saved"
  | "network_error"
  | "wallet_error"
  | "generic";

// Optional navigation action attached to a toast
export interface NotificationAction {
  label: string;
  href: string;
}

// The full shape of a notification (used internally)
export interface Notification {
  /** Unique identifier for the notification */
  id: string;
  type: NotificationType;
  /** Short heading shown in bold */
  title: string;
  /** Optional longer description */
  message?: string;
  /** Auto-dismiss duration in milliseconds. Defaults to 4000. */
  duration?: number;
  /** Optional navigation action shown as a button inside the toast */
  action?: NotificationAction;
  /**
   * Deduplication key – if a notification with the same dedupeKey is already
   * visible, the new one will be silently ignored.
   */
  dedupeKey?: string;
  /** Timestamp when the notification was created */
  createdAt: number;
}

// The payload accepted by the public notify() API
export interface NotifyOptions {
  type: NotificationType;
  title: string;
  message?: string;
  /** Auto-dismiss duration in ms. Error toasts default to 7000 ms. */
  duration?: number;
  action?: NotificationAction;
  /**
   * A stable deduplication key (e.g. event type + resource id).
   * Prevents duplicate toasts for the same real-time event.
   */
  dedupeKey?: string;
}

// Context value exposed to consumers
export interface NotificationContextValue {
  /** Queue of currently visible notifications */
  notifications: Notification[];
  /** Add a new notification. Returns the id of the created notification, or null if deduplicated. */
  notify: (options: NotifyOptions) => string | null;
  /** Manually dismiss a notification by id */
  dismiss: (id: string) => void;
  /** Dismiss all notifications */
  dismissAll: () => void;
}
