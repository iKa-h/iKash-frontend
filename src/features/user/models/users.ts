export interface Users {
    userId: string;
    publicKey: string;
    username?: string;
    alias?: string;
    email?: string;
    notificationsEnabled: boolean;
    preferredCurrency?: string;
    pendingAccountInfo: boolean;
    kycStatus: string;
    kycUpdatedAt?: string;
    totalVolume: string;
    createdAt: string;
    currentNonce?: string;
    bio?: string;
    profileImageUrl?: string;
    securityUpdates?: boolean;
    payment_method?: any[];
    paymentMethods?: any[];
}
