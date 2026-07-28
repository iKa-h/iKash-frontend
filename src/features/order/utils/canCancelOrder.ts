import { Order } from "../models/order";

/**
 * Mirrors the backend eligibility rules in OrderService.cancel()
 * (ikash-backend, src/modules/order/order.service.ts). Keep this in sync
 * with the backend — it exists purely to hide the Cancel Order action when
 * the request would be rejected, not as a source of truth. The backend is
 * always the final authority; this just avoids showing a button that will
 * 409.
 */
const TERMINAL_ORDER_STATUSES = ["released", "cancelled", "expired", "disputed"];

const BLOCKED_ESCROW_STATUSES = [
    "funded",
    "fiat_sent",
    "released",
    "disputed",
    "resolved",
];

export function canCancelOrder(order: Order, currentUserId: string): boolean {
    const isParticipant = order.buyerId === currentUserId || order.sellerId === currentUserId;
    if (!isParticipant) return false;

    if (TERMINAL_ORDER_STATUSES.includes(order.orderStatus)) return false;

    if (order.escrow && BLOCKED_ESCROW_STATUSES.includes(order.escrow.escrowStatus)) {
        return false;
    }

    return true;
}
