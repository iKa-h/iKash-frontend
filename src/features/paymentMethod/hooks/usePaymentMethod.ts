import { useState } from "react";
import { PaymentMethod } from "../models/paymentMethod";

export function usePaymentMethod(publicKey: string | null) {
    const [method, setMethod] = useState<PaymentMethod | null>(null);



    const getMethod = async (methodId: string) => {
        if (!publicKey) return;

        try {
            const res = await fetch(`http://localhost:3000/payment-methods/${methodId}`);
            if (!res.ok) throw new Error('Payment method not found');
            const data = await res.json();
            setMethod(data);
            console.log(data)
        } catch (err) {
            console.error(err);
        }
    }

    return { method, getMethod }
}