export interface Order {
    oderId: string;
    offerId: string;
    buyerId: string;
    sellerId: string;
    assetAmount: string;
    fiatAmount: string;
    orderStatus: string;
    expiresAt: string | null;
}