import { useEffect, useState } from "react";
import { PaymentMethod } from "../models/paymentMethod";

export function usePaymentMethods(publicKey: string | null) {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);

    if (!publicKey) return;

    useEffect(() => {
        fetch('http://localhost:3000/payment-methods')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch payment methods');
                return res.json();
            })
            .then(data => {
                setMethods(data);
            });
    }, [publicKey]);

    return { methods }
}