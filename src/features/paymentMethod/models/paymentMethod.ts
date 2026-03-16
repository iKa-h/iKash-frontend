export interface PaymentMethod {
    paymentId: string;
    userId: string;
    bankName: string;
    accountDetails: string;
    isActive: boolean;
}