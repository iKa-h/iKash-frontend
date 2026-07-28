"use client";

// TODO: Restore backend active-orders integration after the dashboard UI is approved.
// import { useOrders } from "../hooks/useOrders";
// import { useUser } from "@/features/user/presentation/context/UserContext";

// TODO: Replace mockActiveOrders with backend active-order data
// once the new dashboard design is validated.
import { mockActiveOrders } from "../mocks/active-orders.mock";
import { ActiveOrderCard } from "./ActiveOrderCard";

export function ActiveOrdersSection() {
    // TODO: Restore backend active-orders integration after the dashboard UI is approved.
    // const { currentUser } = useUser();
    // const { orders, fetchUserOrders } = useOrders();
    //
    // useEffect(() => {
    //     if (currentUser?.userId) {
    //         fetchUserOrders(currentUser.userId);
    //     }
    // }, [currentUser?.userId, fetchUserOrders]);
    //
    // const activeOrders = orders.filter(
    //     (o) => o.orderStatus !== "cancelled" && o.orderStatus !== "completed"
    // );

    const activeOrders = mockActiveOrders;

    if (activeOrders.length === 0) return null;

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-5 px-1">
                <h2 className="text-white font-bold text-base tracking-wide">
                    Active Orders
                </h2>
            </div>

            {/* Desktop: 3-column grid | Mobile: horizontal scroll */}
            <div
                className="
                    flex gap-4
                    overflow-x-auto pb-2
                    sm:overflow-x-visible sm:pb-0
                    sm:grid sm:grid-cols-2
                    lg:grid lg:grid-cols-3
                "
                style={{ scrollbarWidth: "none" }}
            >
                {activeOrders.map((order) => (
                    <ActiveOrderCard key={order.id} order={order} />
                ))}
            </div>
        </section>
    );
}
