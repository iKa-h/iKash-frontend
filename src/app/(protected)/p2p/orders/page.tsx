"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Aside } from "@/app/components/Aside";
import { Header } from "@/app/components/Header";
import { OrderNavbar } from "../components/OrderNavbar";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useOrders } from "@/features/order/hooks/useOrders";
import { Order } from "@/features/order/models/order";
import { ChevronRight, Calendar, Search, ArrowRight, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";

// Predefined mock data matching the exact ones in the images for high fidelity
const MOCK_ORDERS = [
  {
    orderId: "mock-uuid-1",
    isBuy: true,
    assetAmount: "0.05",
    assetCode: "USDC",
    counterparty: {
      alias: "CryptoKing_99",
      kycStatus: "approved",
    },
    dateStr: "OCT 24, 2026",
    valueUsd: "3,250.00",
    gasFee: "4.20",
    status: "pending",
  },
  {
    orderId: "mock-uuid-2",
    isBuy: false,
    assetAmount: "1,500",
    assetCode: "XLM",
    counterparty: {
      alias: "StellarWhale",
      kycStatus: "approved",
    },
    dateStr: "OCT 21, 2026",
    valueUsd: "210.45",
    gasFee: "0.01",
    status: "completed",
  },
  {
    orderId: "mock-uuid-3",
    isBuy: true,
    assetAmount: "1.20",
    assetCode: "XLM",
    counterparty: {
      alias: "OxDeFi_Master",
      kycStatus: "approved",
    },
    dateStr: "OCT 19, 2026",
    valueUsd: "2,140.12",
    gasFee: "12.50",
    status: "cancelled",
  },
  {
    orderId: "mock-uuid-4",
    isBuy: false,
    assetAmount: "5,000",
    assetCode: "USDT",
    counterparty: {
      alias: "Nova_Trader",
      kycStatus: "approved",
    },
    dateStr: "OCT 15, 2026",
    valueUsd: "5,000.00",
    gasFee: "0.85",
    status: "completed",
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { orders: realOrders, fetchUserOrders } = useOrders();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [operationFilter, setOperationFilter] = useState("All");

  // Fetch real user orders if logged in
  useEffect(() => {
    if (currentUser?.userId) {
      fetchUserOrders(currentUser.userId);
    }
  }, [currentUser?.userId, fetchUserOrders]);

  // Combine real orders with mock orders to ensure high fidelity mockup matches image.png
  const combinedOrders = useMemo(() => {
    const formattedReal = (realOrders || []).map((o: any) => {
      const isBuy = o.buyerId === currentUser?.userId;
      const formattedDate = o.createdAt 
        ? new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()
        : "OCT 22, 2026";
      
      const priceNum = parseFloat(o.offer?.price || "0") || 1;
      const assetAmountNum = parseFloat(o.assetAmount) || 0;
      const totalFiat = parseFloat(o.fiatAmount) || (assetAmountNum * priceNum);

      return {
        orderId: o.orderId,
        isBuy,
        assetAmount: assetAmountNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
        assetCode: o.offer?.assetCode || o.assetCode || "USDC",
        counterparty: {
          alias: isBuy ? (o.seller?.alias || "Merchant") : (o.buyer?.alias || "Buyer"),
          kycStatus: isBuy ? o.seller?.kycStatus : o.buyer?.kycStatus,
        },
        dateStr: formattedDate,
        valueUsd: totalFiat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        gasFee: isBuy ? "0.01" : "0.00",
        status: o.orderStatus === "completed" || o.escrow?.escrowStatus === "released" 
          ? "completed" 
          : o.orderStatus === "cancelled" 
          ? "cancelled" 
          : "pending",
      };
    });

    // Remove duplicates if IDs clash
    const list = [...formattedReal];
    MOCK_ORDERS.forEach(mock => {
      if (!list.some(item => item.orderId === mock.orderId)) {
        list.push(mock);
      }
    });

    return list;
  }, [realOrders, currentUser]);

  // Apply filters
  const filteredOrders = useMemo(() => {
    return combinedOrders.filter(o => {
      // 1. Status Filter
      if (statusFilter !== "ALL" && o.status.toUpperCase() !== statusFilter) {
        return false;
      }
      // 2. Operation Filter
      if (operationFilter !== "All") {
        if (operationFilter === "Buy" && !o.isBuy) return false;
        if (operationFilter === "Sell" && o.isBuy) return false;
      }
      return true;
    });
  }, [combinedOrders, statusFilter, operationFilter]);

  const handleRowClick = (orderId: string) => {
    // Only redirect if it is not a pure mockup UUID
    if (orderId.startsWith("mock-")) {
      // For demo, redirect to first real order or do a notification
      router.push(`/p2p/orders/demo`);
    } else {
      router.push(`/p2p/orders/${orderId.replace(/-/g, "")}`);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#010308] text-white font-space">
      <Aside />
      <div className="flex flex-col flex-1 min-w-0 pb-20 md:pb-0">
        <Header description="trading floor" title="p2p marketplace" />
        <OrderNavbar />

        <main className="flex-1 px-4 md:px-16 pb-12 pt-0 w-full flex flex-col lg:flex-row gap-8 items-start">
          
          {/* SECCIÓN FILTROS (Columna Izquierda) */}
          <div className="w-full lg:w-[378.88px] flex flex-col gap-6 shrink-0 pt-4 lg:pt-12">
            <h2 className="text-[20px] font-black tracking-[-0.6px] uppercase text-white pl-1">
              Filters
            </h2>

            {/* Caja de Filtros Principal */}
            <div className="bg-[#161618] border border-[#1F2937] rounded-3xl p-6 flex flex-col gap-6">
              
              {/* Campo Operations */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-[#64748B] font-bold tracking-[1px] uppercase">
                  Operations
                </label>
                <div className="relative">
                  <select
                    value={operationFilter}
                    onChange={(e) => setOperationFilter(e.target.value)}
                    className="w-full bg-[#1F1F25] text-white border-none rounded-lg p-3 text-sm font-bold uppercase cursor-pointer appearance-none focus:outline-none"
                  >
                    <option value="All">All Ops</option>
                    <option value="Buy">Buy Only</option>
                    <option value="Sell">Sell Only</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                </div>
              </div>

              <div className="h-[1px] bg-[rgba(69,73,50,0.2)]" />

              {/* Status Chips Row */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] text-[#64748B] font-bold tracking-[1px] uppercase">
                  Filter By Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["ALL", "PENDING", "COMPLETED", "CANCELLED"].map((status) => {
                    const isActive = statusFilter === status;
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`text-[10px] font-bold p-[6px_16px] rounded-lg transition-colors cursor-pointer uppercase ${
                          isActive
                            ? "bg-[#CEF100] text-black"
                            : "bg-[#1F1F25] text-[#E4E1E9] hover:bg-gray-800"
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Caja de Date Range */}
            <div className="bg-[#161618] border border-[#1F2937] rounded-3xl p-6 flex flex-col gap-3">
              <label className="text-[10px] text-[#64748B] font-bold tracking-[1px] uppercase">
                Date Range
              </label>
              <div className="flex items-center gap-3 text-white text-xs font-bold uppercase tracking-[-0.3px]">
                <Calendar className="w-4 h-4 text-[#64748B]" />
                <span>Oct 01, 2026 — Oct 31, 2026</span>
              </div>
            </div>

          </div>

          {/* SECCIÓN TABLA DE ORDENES (Columna Derecha) */}
          <div className="w-full flex-1 bg-[#161618] border border-[#1F2937] rounded-[24px] overflow-hidden mt-4 lg:mt-12">
            
            {/* Headers de la Tabla */}
            <div className="hidden md:grid grid-cols-[1.5fr_1.2fr_1fr_1.2fr_1fr_40px] bg-[#0E0E13] p-4 border-b border-[rgba(69,73,50,0.1)] text-[10px] text-[#64748B] font-bold tracking-[1px] uppercase select-none">
              <div>Asset & Type</div>
              <div>Counterparty</div>
              <div>Date</div>
              <div className="text-right">Value (USD)</div>
              <div className="text-center">Status</div>
              <div />
            </div>

            {/* Body de la Tabla */}
            <div className="flex flex-col">
              {filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mb-4 stroke-1" />
                  <p className="font-bold">No orders match selected filters.</p>
                </div>
              ) : (
                filteredOrders.map((o) => (
                  <div
                    key={o.orderId}
                    onClick={() => handleRowClick(o.orderId)}
                    className="grid grid-cols-1 md:grid-cols-[1.5fr_1.2fr_1fr_1.2fr_1fr_40px] gap-4 p-6 border-b border-[rgba(22,22,24,0.05)] items-center hover:bg-[#1C1C1F] transition-colors cursor-pointer select-none"
                  >
                    {/* ASSET & TYPE */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                          o.isBuy
                            ? "bg-[rgba(249,115,22,0.1)] border-[rgba(249,115,22,0.2)] text-[#F97316]"
                            : "bg-[rgba(218,255,0,0.1)] border-[rgba(218,255,0,0.2)] text-[#DAFF00]"
                        }`}
                      >
                        {o.isBuy ? (
                          <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <TrendingUp className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-extrabold uppercase tracking-tight">
                          <span className={o.isBuy ? "text-[#CEF100]" : "text-[#CEF100]"}>
                            {o.isBuy ? "Buying" : "Selling"}{" "}
                          </span>
                          {o.assetAmount} {o.assetCode}
                        </span>
                      </div>
                    </div>

                    {/* COUNTERPARTY */}
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#35343A] overflow-hidden flex items-center justify-center text-[10px] font-black text-[#CBD5E1]">
                        {o.counterparty.alias[0]?.toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-[#CBD5E1]">
                        {o.counterparty.alias}
                      </span>
                    </div>

                    {/* DATE */}
                    <div className="text-xs text-[#94A3B8] font-bold uppercase">
                      {o.dateStr}
                    </div>

                    {/* VALUE (USD) */}
                    <div className="flex flex-col items-end gap-0.5 pr-2">
                      <span className="text-sm font-black text-white">${o.valueUsd}</span>
                      <span className="text-[9px] text-[#64748B] font-bold uppercase tracking-wider">
                        GAS: ${o.gasFee}
                      </span>
                    </div>

                    {/* STATUS PILL */}
                    <div className="flex justify-center">
                      {o.status === "pending" && (
                        <span className="text-[9px] font-bold uppercase tracking-wider border border-[#BCED09] text-[#BCED09] p-[4px_12px] rounded-full">
                          Pending
                        </span>
                      )}
                      {o.status === "completed" && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#BCED09] text-[#010308] p-[4px_12px] rounded-full">
                          Completed
                        </span>
                      )}
                      {o.status === "cancelled" && (
                        <span className="text-[9px] font-bold uppercase tracking-wider border border-[rgba(194,199,208,0.8)] text-[#C2C7D0] p-[4px_12px] rounded-full">
                          Cancelled
                        </span>
                      )}
                    </div>

                    {/* CHEVRON */}
                    <div className="flex justify-end text-gray-500 md:flex">
                      <ChevronRight className="w-4 h-4" />
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
