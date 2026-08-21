export interface SecurityPreferences {
    securityUpdates: boolean;
    loginAlerts: boolean;
    transactionNotifications: boolean;
    escrowStatusUpdates: boolean;
    emailNotifications: boolean;
}

export type SessionStatus = "active" | "expired" | "revoked";

export interface UserSession {
    id: string;
    createdAt: string;
    lastActiveAt?: string;
    ipAddress: string;
    device: string;
    browser?: string;
    os?: string;
    location?: string;
    isCurrent: boolean;
    status: SessionStatus;
}
