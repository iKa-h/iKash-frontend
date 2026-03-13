export interface Users {
    userID: string;
    publicKey: string;
    alias?: string;
    kycStatus: string;
    kycUpdatedAt?: string;
    totalVolume: string;
    createdAt: string;
    currentNonce?: string;
}