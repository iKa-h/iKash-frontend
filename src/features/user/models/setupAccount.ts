export interface SetupAccountPayload {
    alias?: string;
    email?: string;
    notificationsEnabled?: boolean;
    preferredCurrency?: string;
    bankName?: string;
    accountHolderName?: string;
    accountNumber?: string;
    providerId?: string;
    accountIdentifier?: string;
    identificationNumber?: string;
    beneficiaryName?: string;
    description?: string;
    metadata?: Record<string, string>;
}
