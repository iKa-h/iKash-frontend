"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: ToastAction;
}

interface Toast extends ToastOptions {
  id: string;
  type: ToastType;
  message: string;
}

interface NotificationContextType {
  notify: (type: ToastType, message: string, optionsOrDuration?: number | ToastOptions) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const MAX_TOASTS = 3;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((type: ToastType, message: string, optionsOrDuration?: number | ToastOptions) => {
    let options: ToastOptions = {};
    if (typeof optionsOrDuration === "number") {
      options = { duration: optionsOrDuration };
    } else if (optionsOrDuration) {
      options = optionsOrDuration;
    }

    const duration = options.duration ?? 4000;

    setToasts((prev: Toast[]) => {
      // Deduplication: prevent adding if an identical active message exists
      if (prev.some((t: Toast) => t.message === message && t.type === type && t.title === options.title)) {
        return prev;
      }

      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, type, message, ...options };

      const updatedToasts = [...prev, newToast];

      // Remove oldest if exceeding max
      if (updatedToasts.length > MAX_TOASTS) {
        updatedToasts.shift();
      }

      // Schedule removal if duration > 0 (e.g. not Infinity)
      if (duration > 0) {
        setTimeout(() => {
          setToasts((currentToasts: Toast[]) => currentToasts.filter((t: Toast) => t.id !== id));
        }, duration);
      }

      return updatedToasts;
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev: Toast[]) => prev.filter((t: Toast) => t.id !== id));
  }, []);

  const contextValue = useMemo(() => ({ notify, removeToast }), [notify, removeToast]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <div 
        aria-live="polite"
        role="region"
        aria-label="Notifications"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-6 md:right-6 md:left-auto md:translate-x-0 z-[100] flex flex-col gap-3 w-full max-w-sm px-4 md:px-0 pointer-events-none"
      >
        {toasts.map((toast: Toast) => (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start gap-3 p-4 rounded-xl border bg-[#161618] shadow-2xl transition-all duration-300 transform pointer-events-auto motion-safe:animate-in motion-safe:slide-in-from-bottom md:motion-safe:slide-in-from-right
              ${toast.type === "success" ? "border-[#BCED09]/40 text-white" : ""}
              ${toast.type === "error" ? "border-red-500/40 text-white" : ""}
              ${toast.type === "warning" ? "border-yellow-500/40 text-white" : ""}
              ${toast.type === "info" ? "border-blue-500/40 text-white" : ""}
            `}
          >
            {toast.type === "success" && <CheckCircle className="h-5 w-5 text-[#BCED09] shrink-0" />}
            {toast.type === "error" && <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />}
            {toast.type === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />}
            {toast.type === "info" && <Info className="h-5 w-5 text-blue-500 shrink-0" />}

            <div className="flex-1 flex flex-col gap-1">
              {toast.title && <h4 className="text-sm font-bold text-white">{toast.title}</h4>}
              <div className={`text-xs font-semibold ${!toast.title ? "uppercase tracking-wider" : ""}`}>
                {toast.message}
              </div>
              {toast.description && <p className="text-xs text-gray-400 mt-1">{toast.description}</p>}
              {toast.action && (
                <button
                  onClick={() => {
                    toast.action!.onClick();
                    removeToast(toast.id);
                  }}
                  className="mt-2 w-fit text-xs font-bold text-[#BCED09] hover:text-[#d4ff33] transition-colors focus:outline-none focus:ring-2 focus:ring-[#BCED09] rounded px-1 -ml-1"
                >
                  {toast.action.label}
                </button>
              )}
            </div>

            <button 
              onClick={() => removeToast(toast.id)} 
              className="text-gray-400 hover:text-white transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be wrapped in a NotificationProvider");
  return ctx;
}
