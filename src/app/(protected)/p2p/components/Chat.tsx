"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { User, MoreVertical, SendHorizontal, Paperclip, Loader2 } from "lucide-react";
import { useUser } from "@/features/user/presentation/context/UserContext";

type ChatProps = {
    orderId: string;
    chatName?: string;
};

interface Message {
    messageId: string;
    orderId: string;
    senderId: string;
    content: string;
    timestamp: string;
    senderAlias?: string;
}

// Initial mock messages matching the exact screenshots
const INITIAL_MOCK_MESSAGES = (orderId: string, currentUserId: string): Message[] => [
    {
        messageId: "msg-mock-1",
        orderId,
        senderId: "seller-123",
        content: "Hello! I am online and ready to confirm. Please include the order ID in the transfer notes.",
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        senderAlias: "CryptoKing_99"
    },
    {
        messageId: "msg-mock-2",
        orderId,
        senderId: currentUserId,
        content: "Understood. Just initiated the transfer from my mobile app. Will upload the receipt in a moment.",
        timestamp: new Date(Date.now() - 200000).toISOString(), // 3 min ago
        senderAlias: "Buyer"
    },
    {
        messageId: "msg-mock-3",
        orderId,
        senderId: "seller-123",
        content: "Perfect. I'll be monitoring the incoming transactions.",
        timestamp: new Date(Date.now() - 100000).toISOString(), // 1 min ago
        senderAlias: "CryptoKing_99"
    }
];

export const Chat = ({ orderId, chatName = "Merchant Chat" }: ChatProps) => {
    const { currentUser, accessToken } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isCounterpartyTyping, setIsCounterpartyTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const isDemo = orderId === "demo" || orderId.startsWith("mock-");

    // Scroll bottom helper
    const scrollToBottom = useCallback((behavior: "smooth" | "auto" = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, []);

    // Load initial messages
    useEffect(() => {
        if (!currentUser) return;

        if (isDemo) {
            setMessages(INITIAL_MOCK_MESSAGES(orderId, currentUser.userId));
            setTimeout(() => scrollToBottom("auto"), 100);
        } else {
            // Live sync fetch
            fetchMessages();
            
            // Set up polling loop every 1000ms
            pollingIntervalRef.current = setInterval(() => {
                fetchMessages();
            }, 1000);
        }

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [orderId, currentUser, isDemo]);

    // Fetch messages from backend
    const fetchMessages = async () => {
        if (!currentUser) return;
        try {
            const headers: Record<string, string> = {};
            if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat-messages?orderId=${orderId}`, { headers });
            if (res.ok) {
                const data: Message[] = await res.json();
                
                // Only update and scroll if message list actually changed to preserve rendering performance
                setMessages(prev => {
                    if (data.length !== prev.length) {
                        setTimeout(() => scrollToBottom("smooth"), 100);
                        return data;
                    }
                    return prev;
                });
            }
        } catch (err) {
            console.error("Failed to fetch chat messages:", err);
        }
    };

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim() || !currentUser || isSending) return;

        const currentText = inputText.trim();
        setInputText("");
        setIsSending(true);

        if (isDemo) {
            // Add user message to mock state
            const userMsg: Message = {
                messageId: `user-msg-${Date.now()}`,
                orderId,
                senderId: currentUser.userId,
                content: currentText,
                timestamp: new Date().toISOString(),
                senderAlias: currentUser.alias || "Buyer"
            };

            setMessages(prev => [...prev, userMsg]);
            setTimeout(() => scrollToBottom("smooth"), 50);
            setIsSending(false);

            // Simulate counterparty smart response after 1.5 seconds
            setIsCounterpartyTyping(true);
            setTimeout(() => {
                setIsCounterpartyTyping(false);
                const replyText = currentText.toLowerCase().includes("receipt") || currentText.toLowerCase().includes("uploaded")
                    ? "Awesome, checking the payment proof now! Give me a minute to verify on my SEPA portal."
                    : "No problem, please let me know when you lock the funds on-chain.";

                const sellerReply: Message = {
                    messageId: `seller-reply-${Date.now()}`,
                    orderId,
                    senderId: "seller-123",
                    content: replyText,
                    timestamp: new Date().toISOString(),
                    senderAlias: "CryptoKing_99"
                };

                setMessages(prev => [...prev, sellerReply]);
                setTimeout(() => scrollToBottom("smooth"), 50);
            }, 1800);

        } else {
            // Post real message to backend
            try {
                const headers: Record<string, string> = { "Content-Type": "application/json" };
                if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat-messages`, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        orderId,
                        senderId: currentUser.userId,
                        content: currentText
                    })
                });

                if (res.ok) {
                    await fetchMessages();
                }
            } catch (err) {
                console.error("Failed to post message:", err);
            } finally {
                setIsSending(false);
            }
        }
    };

    return (
        <div className="w-full h-full bg-[#1B1B21] flex flex-col overflow-hidden shrink-0 font-space select-none">
            {/* Header */}
            <header className="h-[64px] border-b border-[rgba(69,73,50,0.1)] px-[24px] flex items-center justify-between shrink-0 bg-[#1B1B21]">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 bg-[#35343A] rounded-full flex items-center justify-center border border-white/[0.04] shrink-0">
                        <User className="w-4 h-4 text-white" />
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#DAFF00] border border-[#1B1B21]" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-white font-bold text-[14px] leading-5 font-space">
                            {chatName}
                        </p>
                        <p className="text-[10px] font-bold leading-[15px] tracking-[0.5px] text-[#BCED09] uppercase">
                            Typically replies in 2m
                        </p>
                    </div>
                </div>
                <button className="text-[#8F8389] hover:text-white cursor-pointer px-1">
                    <MoreVertical className="w-5 h-5 text-[#8F8389]" />
                </button>
            </header>
            
            {/* Chat Messages Body */}
            <main className="flex-grow overflow-y-auto p-6 space-y-5 bg-[#1B1B21]/10 scrollbar-thin flex flex-col">
                {/* Order Created status banner */}
                <section className="flex items-center justify-center my-2 shrink-0">
                    <div className="bg-[#1F1F25] px-4 py-1.5 flex items-center justify-center rounded-full border border-[rgba(69,73,50,0.2)]">
                        <p className="uppercase text-[9px] text-[#8F9378] font-bold tracking-widest font-space">
                            ORDER CREATED - {orderId.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                </section>

                <div className="flex-grow space-y-5 flex flex-col justify-end">
                    {messages.map((msg) => {
                        const isOwnMessage = currentUser && msg.senderId === currentUser.userId;
                        const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                            <div
                                key={msg.messageId}
                                className={`flex flex-col gap-1.5 max-w-[85%] transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${
                                    isOwnMessage ? "items-end ml-auto" : "items-start"
                                }`}
                            >
                                <div
                                    className={`text-[12px] leading-relaxed p-[12px_16px] rounded-[12px] font-manrope ${
                                        isOwnMessage
                                            ? "bg-[#DAFF00] text-[#2B3400] font-semibold rounded-br-[4px]"
                                            : "bg-[#1F1F25] text-[#C2C7D0] font-medium rounded-bl-[4px] border border-white/[0.01]"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                                <span className={`text-[9px] text-[#8F8389] font-bold px-1`}>
                                    {timeStr} {isOwnMessage && "• Delivered"}
                                </span>
                            </div>
                        );
                    })}

                    {/* Typing Indicator */}
                    {isCounterpartyTyping && (
                        <div className="flex flex-col items-start gap-1.5 max-w-[85%] transition-all duration-200">
                            <div className="bg-[#1F1F25] text-gray-400 text-[12px] p-[10px_16px] rounded-r-[12px] rounded-bl-[4px] border border-white/[0.01] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-[#BCED09] rounded-full animate-bounce delay-75" />
                                <span className="w-1.5 h-1.5 bg-[#BCED09] rounded-full animate-bounce delay-150" />
                                <span className="w-1.5 h-1.5 bg-[#BCED09] rounded-full animate-bounce delay-300" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>
            
            {/* Input message footer */}
            <form onSubmit={handleSend} className="h-[96px] bg-[#1B1B21] border-t border-[rgba(69,73,50,0.1)] flex flex-col justify-center px-6 shrink-0 gap-1.5">
                <div className="relative flex items-center">
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="bg-[#0E0E13] text-white w-full h-[44px] pl-4 pr-12 rounded-[8px] border border-[rgba(69,73,50,0.3)] focus:border-[#DAFF00]/50 focus:outline-none placeholder:text-[#8F8389CC] text-[12px] font-semibold font-space" 
                        placeholder="Type a message..." 
                    />
                    <div className="absolute right-3 flex items-center gap-2">
                        <button type="submit" className="text-[#DAFF00] hover:scale-105 transition-transform cursor-pointer">
                            <SendHorizontal className="w-5 h-5 text-[#DAFF00]" />
                        </button>
                    </div>
                </div>
                
                {/* Options attachments bar */}
                <div className="flex items-center justify-between px-1 text-[10px] text-[#8F8389] font-bold font-space uppercase tracking-wide">
                    <div className="flex items-center gap-3">
                        <button type="button" className="hover:text-white cursor-pointer transition-colors flex items-center gap-1">
                            <Paperclip className="w-3 h-3" /> Attach
                        </button>
                    </div>
                    <span className="normal-case tracking-normal text-[9px] font-medium text-[#8F8389CC]">Press enter to send</span>
                </div>
            </form>
        </div>
    );
};
