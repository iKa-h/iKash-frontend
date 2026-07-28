import { useState, useCallback } from "react";
import { Order } from "../models/order";
import { CreateOrder } from "../models/createOrder";
import { UpdateOrder } from "../models/updateOrder";
import { useUser } from "../../user/presentation/context/UserContext";

/**
 * Backend errors are shaped as { statusCode, error, message } (see
 * AppException in ikash-backend). This preserves that shape on the client
 * so callers can branch on `err.code` (e.g. "ORDER_CANCELLATION_NOT_ALLOWED")
 * instead of parsing message text.
 */
export class ApiError extends Error {
    status: number;
    code?: string;

    constructor(message: string, status: number, code?: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
    }
}

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [order, setOrder] = useState<Order | null>(null);
    const { accessToken, logout } = useUser();

    const handleResponse = useCallback(async (res: Response, defaultError: string) => {
        if (res.status === 401) {
            logout();
            throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        }
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const msg = errData.message ? (Array.isArray(errData.message) ? errData.message.join(', ') : errData.message) : defaultError;
            throw new ApiError(msg, res.status, errData.error);
        }
        return res.json();
    }, [logout]);

    const fetchUserOrders = useCallback(async (userId: string) => {
        try {
            const headers: Record<string, string> = { "Content-type": "application/json" };
            if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders?userId=${userId}`, { headers });
            const data = await handleResponse(res, 'Orders not found');
            setOrders(data);
        } catch (err) {
            console.error(err);
        }
    }, [accessToken, handleResponse]);

    const getOrder = async (orderId: string) => {
        try {
            const headers: Record<string, string> = { "Content-type": "application/json" };
            if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, { headers });
            const data = await handleResponse(res, 'Get order error');
            setOrder(data);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const createOrder = async (newOrder: CreateOrder) => {
        try {
            const headers: Record<string, string> = { "Content-type": "application/json" };
            if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: "POST",
                headers,
                body: JSON.stringify(newOrder)
            });
            const data = await handleResponse(res, 'Creation order error');
            setOrder(data);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const updateOrder = async (updateOrder: UpdateOrder, orderId: string) => {
        try {
            const headers: Record<string, string> = { "Content-type": "application/json" };
            if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify(updateOrder)
            });
            const data = await handleResponse(res, 'Update order error');
            setOrder(data);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const cancelOrder = async (orderId: string) => {
        try {
            const headers: Record<string, string> = { "Content-type": "application/json" };
            if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`, {
                method: "POST",
                headers,
            });
            const data = await handleResponse(res, 'Cancel order error');
            setOrder(data);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return { orders, order, createOrder, getOrder, updateOrder, cancelOrder, fetchUserOrders };
}
