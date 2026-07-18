"use client";

import { useNotifications } from "../../features/notifications/hooks/useNotifications";

/**
 * Toast Demo Page  –  /toast-demo
 *
 * A simple visual verification page that lets you trigger every variant of
 * the global notification system directly in the browser.
 *
 * This page exists only for development/QA purposes.
 */
export default function ToastDemoPage() {
  const { notifySuccess, notifyError, notifyWarning, notifyInfo, notifyEvent, dismissAll } =
    useNotifications();

  return (
    <main className="min-h-screen bg-[#010308] text-white flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold text-[#BCED09]">Toast Notification Demo</h1>
      <p className="text-gray-400 text-sm max-w-md text-center">
        Click any button to trigger a toast. Toasts stack in the top-right on
        desktop and top-center on mobile. They auto-dismiss after their
        configured duration or can be dismissed manually.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl">
        {/* Basic variants */}
        <button
          onClick={() =>
            notifySuccess("Escrow funded", "The escrow was funded successfully.")
          }
          className="px-4 py-2 rounded-lg bg-[#BCED09]/10 border border-[#BCED09]/40 text-[#BCED09] text-sm font-semibold hover:bg-[#BCED09]/20 transition"
        >
          ✅ Success
        </button>

        <button
          onClick={() =>
            notifyError("Transaction failed", "Please try again later.")
          }
          className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition"
        >
          ❌ Error
        </button>

        <button
          onClick={() =>
            notifyWarning(
              "Wrong Stellar network",
              "Please switch to TESTNET to continue."
            )
          }
          className="px-4 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-sm font-semibold hover:bg-yellow-400/20 transition"
        >
          ⚠️ Warning
        </button>

        <button
          onClick={() =>
            notifyInfo("Dispute opened", "A dispute has been opened for order #12345.")
          }
          className="px-4 py-2 rounded-lg bg-blue-400/10 border border-blue-400/40 text-blue-400 text-sm font-semibold hover:bg-blue-400/20 transition"
        >
          ℹ️ Info
        </button>

        {/* With action */}
        <button
          onClick={() =>
            notifyInfo("New order received", undefined, {
              label: "View order",
              href: "/",
            })
          }
          className="px-4 py-2 rounded-lg bg-blue-400/10 border border-blue-400/40 text-blue-400 text-sm font-semibold hover:bg-blue-400/20 transition"
        >
          🔗 With Action
        </button>

        {/* Real-time event (auto deduplicated) */}
        <button
          onClick={() =>
            notifyEvent("chat_message", {
              type: "info",
              title: "New message received",
              message: "John: Hey, have you sent the payment?",
              resourceId: "msg-demo-1",
            })
          }
          className="px-4 py-2 rounded-lg bg-blue-400/10 border border-blue-400/40 text-blue-400 text-sm font-semibold hover:bg-blue-400/20 transition"
        >
          💬 Chat Event (deduped)
        </button>

        <button
          onClick={() =>
            notifyEvent("escrow_funded", {
              type: "success",
              title: "Escrow funded",
              message: "Order #98765 escrow has been funded.",
              resourceId: "ord-98765",
            })
          }
          className="px-4 py-2 rounded-lg bg-[#BCED09]/10 border border-[#BCED09]/40 text-[#BCED09] text-sm font-semibold hover:bg-[#BCED09]/20 transition"
        >
          🔒 Escrow Funded
        </button>

        <button
          onClick={() =>
            notifyEvent("escrow_released", {
              type: "success",
              title: "Escrow released",
              message: "Funds have been released to the seller.",
              resourceId: "ord-98765",
            })
          }
          className="px-4 py-2 rounded-lg bg-[#BCED09]/10 border border-[#BCED09]/40 text-[#BCED09] text-sm font-semibold hover:bg-[#BCED09]/20 transition"
        >
          🔓 Escrow Released
        </button>

        <button
          onClick={() =>
            notifyEvent("dispute_opened", {
              type: "warning",
              title: "Dispute opened",
              message: "A dispute has been filed for order #33333.",
              resourceId: "ord-33333",
            })
          }
          className="px-4 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-sm font-semibold hover:bg-yellow-400/20 transition"
        >
          ⚖️ Dispute
        </button>

        <button
          onClick={() =>
            notifyEvent("network_error", {
              type: "error",
              title: "Network error",
              message: "Could not connect to the Stellar network.",
            })
          }
          className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/40 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition"
        >
          🌐 Network Error
        </button>

        {/* Spam test */}
        <button
          onClick={() => {
            for (let i = 0; i < 8; i++) {
              notifyInfo(`Notification ${i + 1}`, "Spam test – only 5 visible at once.");
            }
          }}
          className="col-span-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/40 text-purple-400 text-sm font-semibold hover:bg-purple-500/20 transition"
        >
          🚀 Spam (8 toasts – max 5 shown)
        </button>

        {/* Dismiss all */}
        <button
          onClick={dismissAll}
          className="col-span-2 sm:col-span-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-300 text-sm font-semibold hover:bg-gray-600 transition"
        >
          🗑 Dismiss All
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-4">
        Navigate to{" "}
        <a href="/" className="underline text-gray-500 hover:text-gray-300">
          /
        </a>{" "}
        to verify toasts work across pages.
      </p>
    </main>
  );
}
