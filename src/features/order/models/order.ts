import { Offer } from "../../offer/models/offer";
import { Users } from "../../user/models/users";

export interface EscrowOnChain {
    escrowId: string;
    orderId: string;
    contractId?: string | null;
    escrowStatus: "pending" | "initialized" | "funded" | "fiat_sent" | "released" | "disputed" | "resolved";
    amount?: number | string | null;
    buyerAddress?: string | null;
    sellerAddress?: string | null;
    txHashLock?: string | null;
    txHashRelease?: string | null;
    evidenceUrl?: string | null;
}

export interface Order {
    orderId: string;
    oderId?: string;
    offerId: string;
    buyerId: string;
    sellerId: string;
    assetAmount: string;
    fiatAmount: string;
    orderStatus: string;
    expiresAt: string | null;
    createdAt?: string;
    assetCode?: string;
    offer?: Offer;
    escrow?: EscrowOnChain | null;
    buyer?: Users;
    seller?: Users;
}
