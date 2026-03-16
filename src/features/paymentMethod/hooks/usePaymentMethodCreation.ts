import { useState } from "react";
import { PaymentMethod } from "../models/paymentMethod";
import { CreatePaymentMethod } from "../models/createPaymentMethod";

export function usePaymentMethodCreation(publicKey: string | null) {
    const [method, setMethod] = useState<PaymentMethod | null>(null);

    const createPaymentMethod = async (paymentMethod: CreatePaymentMethod) => {
        const res = await fetch('http://localhost:3000/payment-methods', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(paymentMethod)
        });
        if (!res.ok) throw new Error('Create Error');
        const data = await res.json();
        setMethod(data);
    }

    return { method, createPaymentMethod }
}