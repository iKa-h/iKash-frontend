"use client";

import { use, useEffect, useState, useCallback, useMemo } from "react";
import { Aside } from "@/app/components/Aside";
import { Header } from "@/app/components/Header";
import { TradeDetails } from "../components/TradeDetails";
import { TradeEvidenceUploader } from "../components/TradeEvidenceUploader";
import { EvidencePreview } from "../components/EvidencePreview";
import { Chat } from "../../components/Chat";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useOrders } from "@/features/order/hooks/useOrders";
import { Order } from "@/features/order/models/order";
import { ArrowLeft, AlertTriangle, Ban, Loader2 } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ orderId: string }>;
}

function restoreUuidDashes(uuid: string): string {
    if (uuid.length !== 32) return uuid;
    return `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
}

export default function TradePage({ params }: PageProps) {
    const { orderId } = use(params);
    const { currentUser } = useUser();
    const { getOrder } = useOrders();

    const [order, setOrder] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    // Create a demo order object when path is /demo or starting with mock-
    const demoOrder = useMemo(() => {
        if (!currentUser) return null;
        return {
            orderId: "mock-uuid-1",
            buyerId: currentUser.userId,
            sellerId: "seller-123",
            assetAmount: "0.05",
            fiatAmount: "3250.00",
            orderStatus: "pending",
            createdAt: "2026-10-24T12:00:00.000Z",
            expiresAt: "2026-10-24T13:00:00.000Z",
            buyer: {
                userId: currentUser.userId,
                alias: currentUser.alias || "Buyer",
                publicKey: currentUser.publicKey || "G_BUYER_KEY_MOCK...",
                kycStatus: currentUser.kycStatus || "approved",
            },
            seller: {
                userId: "seller-123",
                alias: "CryptoKing_99",
                publicKey: "G_SELLER_KEY_MOCK...",
                kycStatus: "approved",
            },
            offer: {
                offerId: "offer-1",
                price: "65000",
                assetCode: "USDC",
                type: "sell",
                minAmount: "10",
                maxAmount: "10000",
                payment_methods: [
                    {
                        payment_id: "pm-1",
                        bankName: "Bank Transfer SEPA",
                        account_identifier: "ES12 3456 7890 1234 5678",
                        beneficiary_name: "QuantVortex_LP",
                        payment_provider: {
                            name: "Bank Transfer SEPA",
                            type: "bank",
                        }
                    }
                ],
                paymentMethods: [
                    {
                        paymentId: "pm-1",
                        bankName: "Bank Transfer SEPA",
                        accountDetails: "ES12 3456 7890 1234 5678",
                        beneficiaryName: "QuantVortex_LP",
                        type: "bank"
                    }
                ]
            },
            escrow: {
                escrowId: "escrow-mock-1",
                escrowStatus: "pending",
                buyerAddress: currentUser.publicKey || "G_BUYER_KEY_MOCK...",
                sellerAddress: "G_SELLER_KEY_MOCK...",
                amount: "0.05",
            }
        };
    }, [currentUser]);

    const fetchOrder = useCallback(async () => {
        if (orderId === "demo" || orderId.startsWith("mock-")) {
            setOrder(demoOrder);
            setIsLoading(false);
            return;
        }

        try {
            const dashedId = restoreUuidDashes(orderId);
            const data = await getOrder(dashedId);
            if (!data) {
                setErrorMsg("Order not found");
            } else {
                setOrder(data);
            }
        } catch (err: any) {
            console.error("Error fetching order:", err);
            setErrorMsg("Error loading order details");
        } finally {
            setIsLoading(false);
        }
    }, [orderId, getOrder, demoOrder]);

    useEffect(() => {
        if (currentUser) {
            fetchOrder();
        }
    }, [currentUser, fetchOrder]);

    if (!currentUser) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-[#010308]">
                <Aside />
                <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                    <Header description="trading floor" title="p2p marketplace" />
                    <main className="flex flex-col items-center justify-center flex-1 bg-[#010308]">
                        <p className="text-white text-lg font-bold font-space">Please log in to view this trade.</p>
                    </main>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-[#010308]">
                <Aside />
                <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                    <Header description="trading floor" title="p2p marketplace" />
                    <main className="flex flex-col items-center justify-center flex-1 bg-[#010308]">
                        <Loader2 className="animate-spin h-12 w-12 text-[#DAFF00]" />
                        <p className="text-[#C2C7D0] mt-4 font-semibold font-space">Loading transaction details...</p>
                    </main>
                </div>
            </div>
        );
    }

    if (errorMsg || !order) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-[#010308]">
                <Aside />
                <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                    <Header description="trading floor" title="p2p marketplace" />
                    <main className="flex flex-col items-center justify-center flex-1 bg-[#010308]">
                        <AlertTriangle className="w-12 h-12 text-[#DAFF00] mb-2" />
                        <p className="text-white text-lg font-bold font-space">{errorMsg || "Transaction details unavailable"}</p>
                    </main>
                </div>
            </div>
        );
    }

    const isBuyer = currentUser.userId === order.buyerId;
    const isSeller = currentUser.userId === order.sellerId;

    if (!isBuyer && !isSeller) {
        return (
            <div className="flex h-screen w-full overflow-hidden bg-[#010308]">
                <Aside />
                <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                    <Header description="trading floor" title="p2p marketplace" />
                    <main className="flex flex-col items-center justify-center flex-1 bg-[#010308]">
                        <Ban className="w-12 h-12 text-red-500 mb-2" />
                        <p className="text-white text-lg font-bold font-space">You are not authorized to view this trade.</p>
                    </main>
                </div>
            </div>
        );
    }

    const role = isBuyer ? "buyer" : "seller";
    const amountVal = parseFloat(order.assetAmount) || 0;
    const priceVal = parseFloat(order.offer?.price || "0") || 0;
    const totalVal = parseFloat(order.fiatAmount) || (amountVal * priceVal);
    
    const paymentMethodObj = order.offer?.payment_methods?.[0] || order.offer?.paymentMethods?.[0];
    
    let paymentType: "platform" | "web" | "bank" = "bank";
    const typeStr = (paymentMethodObj?.payment_provider?.type || paymentMethodObj?.type || "bank").toLowerCase();
    if (typeStr.includes("platform") || typeStr.includes("internal")) {
        paymentType = "platform";
    } else if (typeStr.includes("web") || typeStr.includes("wallet") || typeStr.includes("online")) {
        paymentType = "web";
    } else {
        paymentType = "bank";
    }

    const paymentMethodLabel = paymentMethodObj?.payment_provider?.name || paymentMethodObj?.bankName || "Bank Transfer SEPA";
    
    const accountIdentifier = 
        paymentMethodObj?.accountIdentifier || 
        paymentMethodObj?.account_identifier || 
        paymentMethodObj?.accountDetails || 
        "No details provided";
        
    const accountOwner = 
        paymentMethodObj?.beneficiaryName || 
        paymentMethodObj?.beneficiary_name || 
        order.seller?.alias || 
        "QuantVortex_LP";

    const escrowId = order.escrow?.escrowId;
    const escrowStatus = order.escrow?.escrowStatus || "pending";
    const buyerAddress = order.escrow?.buyerAddress || order.buyer?.publicKey;
    const sellerAddress = order.escrow?.sellerAddress || order.seller?.publicKey;

    const counterpartyUser = isBuyer ? order.seller : order.buyer;
    const isCompleted = order.escrow?.escrowStatus === 'released';

    return (
        <div className="flex min-h-screen w-full overflow-hidden bg-[#010308] pb-20 md:pb-0">
            <Aside />
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
                <Header description="trading floor" title="p2p marketplace" />
                <main className="flex flex-col md:flex-row items-start w-full h-[calc(100vh-96px)] overflow-hidden bg-[#010308] min-h-0 select-none">
                    
                    {/* COLUMNA IZQUIERDA: Panel de Transacción */}
                    <div className="w-full md:w-[1172px] h-full flex flex-col border-r border-[rgba(69,73,50,0.1)] bg-[#010308] shrink-0 min-h-0">
                        
                        {/* Subheader superior de navegación */}
                        <div className="h-[64px] border-b border-[rgba(69,73,50,0.1)] bg-[rgba(19,19,24,0.6)] backdrop-blur-md px-4 md:px-[60px] flex items-center justify-between shrink-0">
                            <Link 
                                href="/p2p/orders"
                                className="text-[#9CA3AF] hover:text-white flex items-center gap-2 text-[14px] font-bold uppercase tracking-[-0.35px] transition-colors cursor-pointer font-space"
                            >
                                <ArrowLeft className="w-4 h-4 text-[#9CA3AF] stroke-[3px]" /> BACK TO ORDERS
                            </Link>
                            <div className="flex items-center gap-3 select-none">
                                {!isCompleted && (
                                    <>
                                        <span className="w-2 h-2 rounded-full bg-[#DAFF00] animate-pulse shadow-[0_0_8px_rgba(218,255,0,0.6)]" />
                                        <span className="text-[#DAFF00] text-[12px] font-bold tracking-[2.4px] uppercase font-space">
                                            TRANSACTION IN PROGRESS
                                        </span>
                                    </>
                                )}
                            </div>
                            <h2 className="text-white font-black text-[20px] leading-7 uppercase tracking-normal font-space hidden md:block">
                                ORDER DETAILS
                            </h2>
                        </div>

                        {/* Contenedor Principal Escalado por Rol */}
                        <div className="grow flex flex-col p-4 md:p-[32px_64px_40px_64px] overflow-auto justify-between items-center min-h-0 w-full">
                            
                            {isBuyer ? (
                                <div className="flex flex-col items-center justify-center h-full w-full">
                                    <div className="flex flex-col md:flex-row items-start gap-4 shrink-0 min-h-0 w-full">
                                        <div className="w-full md:w-[616.2px] h-full shrink-0">
                                            <TradeDetails 
                                                role={role}
                                                amount={amountVal}
                                                assetCode={order.offer?.assetCode || "USDC"}
                                                unitPrice={priceVal}
                                                total={totalVal}
                                                paymentMethod={paymentMethodLabel}
                                                paymentType={paymentType}
                                                accountIdentifier={accountIdentifier}
                                                accountOwner={accountOwner}
                                                counterpartyName={counterpartyUser?.alias || "Seller"}
                                                counterpartyRate="99.8%"
                                                counterpartyKyc={counterpartyUser?.kycStatus === "approved"}
                                            />
                                        </div>
                                        <div className="w-full md:w-[402.8px] h-full shrink-0">
                                            <TradeEvidenceUploader 
                                                orderId={order.orderId}
                                                escrowId={escrowId}
                                                escrowStatus={escrowStatus}
                                                buyerAddress={buyerAddress}
                                                amount={amountVal}
                                                onStatusChange={fetchOrder}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6 w-full h-full items-center justify-center">
                                    
                                    {!isCompleted && (
                                        <div className="w-full bg-[rgba(26,27,33,0.7)] border border-[rgba(218,255,0,0.15)] rounded-[12px] p-4 md:p-[18px_28px] flex flex-col md:flex-row items-center justify-between shrink-0 gap-2">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-[#DAFF00] shadow-[0_0_6px_#DAFF00]" />
                                                    <span className="text-[#DAFF00] font-black text-[15px] tracking-[1.5px] uppercase font-space">
                                                        AWAITING BUYER PAYMENT
                                                    </span>
                                                </div>
                                                <span className="text-[#9CA3AF] text-[13px] font-space font-medium uppercase tracking-wider">
                                                    Order #{order.orderId?.split("-")[0]?.toUpperCase() || "P2P-B829"}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-end justify-center">
                                                <span className="text-white font-black text-[28px] font-space leading-none tracking-wide">
                                                    14:52
                                                </span>
                                                <span className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-[1px] font-space mt-1">
                                                    REMAINING TIME
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                        <TradeDetails 
                                            role={role}
                                            amount={amountVal}
                                            assetCode={order.offer?.assetCode || "USDC"}
                                            unitPrice={priceVal}
                                            total={totalVal}
                                            paymentMethod={paymentMethodLabel}
                                            paymentType={paymentType}
                                            accountIdentifier={accountIdentifier}
                                            accountOwner={accountOwner}
                                            counterpartyName={counterpartyUser?.alias || "Buyer"}
                                            counterpartyRate="95.5%"
                                            counterpartyKyc={counterpartyUser?.kycStatus === "approved"}
                                        />
                                        <EvidencePreview 
                                            orderId={order.orderId}
                                            escrowId={escrowId}
                                            escrowStatus={escrowStatus}
                                            sellerAddress={sellerAddress}
                                            amount={amountVal}
                                            expiresAt={order.expiresAt as string | undefined}
                                            onStatusChange={fetchOrder}
                                        />
                                    </div>

                                    <div className="w-full bg-[#191A1E] rounded-xl p-5 flex flex-col gap-1 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-[#ff8800]" />
                                            <span className="text-white font-bold text-[15px] font-space uppercase tracking-wide">
                                                Do not release crypto before verifying funds
                                            </span>
                                        </div>
                                        <p className="text-[#C2C7D0] text-[14px] font-space">
                                            Ensure the buyer's name on the bank transfer matches their verified profile name (
                                            <span className="font-bold text-white">{order.buyer?.alias || "Buyer"}</span>
                                            ). Third-party payments are against our terms of service.
                                        </p>
                                    </div>
                                    
                                    <div className="w-full flex flex-row items-center justify-end pt-2 shrink-0">
                                        <button className="text-[#FF6B6B] hover:text-red-400 font-bold font-space uppercase text-[14px] tracking-[0.5px] transition-colors cursor-pointer">
                                            Report Issue
                                        </button>
                                    </div>
                                    
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Componente de Chat global */}
                    <div className="w-full md:w-[460px] h-full bg-[#1B1B21] flex flex-col shrink-0 min-h-0">
                        <Chat 
                            orderId={order.orderId} 
                            chatName={counterpartyUser?.alias || (isBuyer ? "Seller" : "Buyer")} 
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}