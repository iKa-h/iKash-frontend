import { useEffect, useState } from "react";
import { PaymentMethod } from "../models/paymentMethod";
import { CreatePaymentMethod } from "../models/createPaymentMethod";
import { UpdatePaymentMethod } from "../models/updatePaymentMethod";

export function usePaymentMethods() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [method, setMethod] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch payment methods');
                return res.json();
            })
            .then(data => {
                setMethods(data);
            });
    }, []);

    const getPaymentMethod = async (methodId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods/${methodId}`);
            if (!res.ok) throw new Error('Payment method not found');
            const data = await res.json();
            setMethod(data);
        } catch (error) {
            console.error(error);
        }
    }

    const createPaymentMethod = async (paymentMethod: CreatePaymentMethod) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(paymentMethod)
            });
            if (!res.ok) throw new Error('Create Error');
            const data = await res.json();
            setMethod(data);
        } catch (error) {
            console.error(error);
        }
    }

    const updateMethod = async (methodId: string, update: UpdatePaymentMethod) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods/${methodId}`, {
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

    const deleteMethod = async (methodId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods/${methodId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error('Payment method not found');
            const data = await res.json();
            setMethod(data);
        } catch (error) {
            console.error(error);
        }
    }

    return { methods, method, getPaymentMethod, createPaymentMethod, updateMethod, deleteMethod }
}