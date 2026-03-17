"use client";

import { useOffer } from "@/features/offer/hooks/useOffer";
import { useOrders } from "@/features/order/hooks/useOrders";
import { useWallet } from "@/features/wallet";

export default function Test() {
    useOrders();
    

    const handle = () => {
        console.log('handle')
    }

    return (
        <div>
            <h1>Tests</h1>
            <button className="cursor-pointer bg-amber-900" onClick={handle}>
                Update Payment Method
            </button>
        </div>
    );
}