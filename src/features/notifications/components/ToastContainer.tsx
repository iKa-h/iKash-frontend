"use client";

import { useNotificationContext } from "../context/NotificationContext";
import { ToastItem } from "./ToastItem";

/**
 * ToastContainer
 *
 * Renders the floating notification stack.  Must be rendered once inside the
 * NotificationProvider tree, typically in the root layout.
 *
 * Positioning:
 *  – Desktop: top-right
 *  – Mobile  : top-center (via responsive Tailwind classes)
 *
 * Accessibility:
 *  – Wraps the stack in an ARIA live region labelled "Notifications".
 *  – Individual ToastItem components set their own aria-live urgency.
 */
export function ToastContainer() {
  const { notifications, dismiss } = useNotificationContext();

  if (notifications.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className={[
        // Positioning – fixed, above everything
        "fixed z-[9999] pointer-events-none",
        // Mobile: top-center, full width with padding
        "top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm",
        // Desktop: top-right, no transform
        "sm:left-auto sm:right-6 sm:translate-x-0 sm:w-80",
        // Stack layout
        "flex flex-col gap-3",
      ].join(" ")}
    >
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <ToastItem notification={notification} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  );
}
