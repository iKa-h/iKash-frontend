"use client";

import { useChatMessages } from "@/features/chat/hooks/useChatMessages";
import { Message } from "@/features/chat/models/message";
import { useEffect, useState } from "react";

export default function Test() {
    const { messages, getMessages } = useChatMessages();
    const [chatMessages, setChatMessages] = useState<Message[]>([]);

    const handle = () => {
        getMessages('b989700b-173f-4d3f-afaa-978e0b0bb591');
    }

    useEffect(() => {
        setChatMessages(messages);
    }, [messages, chatMessages]);

    return (
        <div>
            <h1>Tests</h1>
            <button className="cursor-pointer bg-amber-900" onClick={handle}>
                Get messages
            </button>

            {
                chatMessages.map((m) => (
                    <p key={m.messageId}>{m.content}</p>
                ))
            }
        </div>
    );
}