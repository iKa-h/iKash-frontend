import { useEffect, useState } from "react";
import { Order } from "../models/order";
import { CreateOrder } from "../models/createOrder";
import { UpdateOrder } from "../models/updateOrder";

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`)
            .then(res => {
                if (!res.ok) throw new Error('Orders not found');
                return res.json();
            })
            .then(data => {
                setOrders(data);
                console.log(data)
            })
            .catch(err => console.error(err));
    }, []);

    const getOrder = async (orderId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);
            if (!res.ok) throw new Error('Creation order error');
            const data = await res.json();
            setOrder(data);
        } catch (error) {
            console.error(error);
        }
    }

    const createOrder = async (newOrder: CreateOrder) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(newOrder)
            });
            if (!res.ok) throw new Error('Creation order error');
            const data = await res.json();
            setOrder(data);
        } catch (error) {
            console.error(error);
        }
    }

    const updateOrder = async (updateOrder: UpdateOrder, orderId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(updateOrder)
            });
            if (!res.ok) throw new Error('Update order error');
            const data = await res.json();
            setOrder(data);
        } catch (error) {

        }
    }

    return { orders, order, createOrder, getOrder, updateOrder }
}