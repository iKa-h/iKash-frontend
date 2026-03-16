import { useState } from "react";
import { PaymentMethod } from "../models/paymentMethod";

export function usePaymentMethodDelete(publicKey: string | null) {
    const [method, setmethod] = useState<PaymentMethod | null>(null);

    const deleteMethod = async (methodId: string) => {
        if (!publicKey) return;

        try {
            const res = await fetch(`http://localhost:3000/payment-methods/${methodId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error('Payment method not found');
            const data = await res.json();
            setmethod(data);
        } catch (error) {
            console.error(error);
        }
    }

    return { method, deleteMethod }
}