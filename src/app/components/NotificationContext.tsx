"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface NotificationContextType {
  notify: (type: ToastType, message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border bg-[#161618] shadow-2xl transition-all duration-300 transform translate-y-0 animate-in slide-in-from-right pointer-events-auto
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

            <div className="flex-1 text-xs font-semibold uppercase tracking-wider">{toast.message}</div>

            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-white transition-colors shrink-0">
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
