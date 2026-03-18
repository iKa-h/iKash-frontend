import { useState } from "react";
import { Message } from "../models/message";
import { CreateMessage } from "../models/createMessage";

export function useChatMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<Message | null>(null);

    const getMessages = async (orderId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat-messages?orderId=${orderId}`);
            if (!res.ok) throw new Error('Messages not found');
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    }

    const getMessage = async (messageId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat-messages/${messageId}`);
            if (!res.ok) throw new Error('Message not found');
            const data = await res.json();
            setMessage(data);
        } catch (error) {
            console.log(error);
        }
    }

    const createMessage = async (newMessage: CreateMessage) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat-messages`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(newMessage)
            });
            if (!res.ok) throw new Error('Create chat message error');
            const data = await res.json();
            setMessage(data);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteMessage = async (messageId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat-messages/${messageId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error('Delete chat message error');
            const data = await res.json();
            setMessage(data);
        } catch (error) {
            console.log(error);
        }
    }

    return { messages, message, getMessages, getMessage, createMessage, deleteMessage }
}