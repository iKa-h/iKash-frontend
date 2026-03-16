"use client";

import { UsePaymentMethodUpdate } from "@/features/paymentMethod/hooks/usePaymentMethodUpdate";
import { useWallet } from "@/features/wallet";

export default function Test() {
    const { publicKey } = useWallet();
    const { updateMethod } = UsePaymentMethodUpdate(publicKey);

    const handle = () => {
        updateMethod(
            "68e2346f-b12f-42ae-898b-87f2b627f6ed",
            {
                bankName: "Banco Jeff"
            })
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