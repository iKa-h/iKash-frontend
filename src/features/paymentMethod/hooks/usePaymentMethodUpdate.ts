import { useState } from "react";
import { PaymentMethod } from "../models/paymentMethod";
import { UpdatePaymentMethod } from "../models/updatePaymentMethod";

export function UsePaymentMethodUpdate(publicKey: string | null) {
    const [method, setMethod] = useState<PaymentMethod | null>(null);

    const updateMethod = async (methodId: string, update: UpdatePaymentMethod) => {
        if (!publicKey) return;

        try {
            const res = await fetch(`http://localhost:3000/payment-methods/${methodId}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(update)
            });
            if (!res.ok) throw new Error('Payment method not found');
            const data = await res.json();
            setMethod(data);
        } catch (err) {
            console.error(err);
        }
    }

    return { method, updateMethod }
}