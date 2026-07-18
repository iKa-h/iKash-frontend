"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
} from "lucide-react";
import type { Notification } from "../types/notification.types";

interface ToastItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

/** Icon and colour tokens for each notification variant. */
const VARIANT_CONFIG = {
  success: {
    Icon: CheckCircle,
    iconClass: "text-[#BCED09]",
    borderClass: "border-[#BCED09]/40",
    labelClass: "text-[#BCED09]",
    label: "Success",
  },
  error: {
    Icon: AlertCircle,
    iconClass: "text-red-500",
    borderClass: "border-red-500/40",
    labelClass: "text-red-500",
    label: "Error",
  },
  warning: {
    Icon: AlertTriangle,
    iconClass: "text-yellow-400",
    borderClass: "border-yellow-400/40",
    labelClass: "text-yellow-400",
    label: "Warning",
  },
  info: {
    Icon: Info,
    iconClass: "text-blue-400",
    borderClass: "border-blue-400/40",
    labelClass: "text-blue-400",
    label: "Info",
  },
} as const;

/**
 * ToastItem
 *
 * Renders a single toast notification.  Handles:
 * – Visual variant (icon, border, label)
 * – Progress bar that shrinks over the auto-dismiss duration
 * – Manual dismiss via button or keyboard (Escape / Enter / Space)
 * – Optional navigation action
 * – Reduced-motion preference
 */
export function ToastItem({ notification, onDismiss }: ToastItemProps) {
  const router = useRouter();
  const { id, type, title, message, duration = 4000, action } = notification;
  const config = VARIANT_CONFIG[type] ?? VARIANT_CONFIG.info;
  const { Icon } = config;

  // Animate-in state
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check reduced-motion preference once on mount
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    // Defer a frame so the CSS transition plays
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  /** Keyboard handler: Escape / Enter / Space dismisses the toast. */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onDismiss(id);
    }
  };

  const handleAction = () => {
    if (!action) return;
    try {
      router.push(action.href);
    } catch {
      // Navigation failure must not crash the app
    }
    onDismiss(id);
  };

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live={type === "error" || type === "warning" ? "assertive" : "polite"}
      aria-atomic="true"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={[
        "relative flex items-start gap-3 p-4 rounded-xl border bg-[#161618] shadow-2xl",
        "outline-none focus-visible:ring-2 focus-visible:ring-white/30",
        "transition-all duration-300",
        config.borderClass,
        prefersReducedMotion
          ? "opacity-100 translate-x-0"
          : visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8",
      ].join(" ")}
    >
      {/* Type icon */}
      <Icon
        className={`h-5 w-5 shrink-0 mt-0.5 ${config.iconClass}`}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Screen-reader-only type label */}
        <span className="sr-only">{config.label}: </span>

        {/* Visible type badge */}
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${config.labelClass}`}
        >
          {config.label}
        </span>

        <p className="text-sm font-semibold text-white leading-snug mt-0.5">
          {title}
        </p>

        {message && (
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            {message}
          </p>
        )}

        {action && (
          <button
            onClick={handleAction}
            className={`mt-2 text-xs font-semibold underline underline-offset-2 ${config.labelClass} hover:opacity-80 transition-opacity`}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="text-gray-500 hover:text-white transition-colors shrink-0 mt-0.5 rounded focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Progress bar */}
      {!prefersReducedMotion && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl overflow-hidden"
          aria-hidden="true"
        >
          <div
            className={`h-full ${config.iconClass.replace("text-", "bg-")} origin-left`}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}
