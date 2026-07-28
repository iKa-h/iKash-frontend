// TODO: Replace mockActiveOrders with backend active-order data
// once the new dashboard design is validated.

export interface ActiveOrderMock {
    id: string;
    role: 'BUYING' | 'SELLING';
    status: string;
    assetAmount: string;
    assetCode: string;
    paymentMethod: string;
    counterpartyName: string;
    counterpartyProfileImageUrl?: string;
    unitPrice: string;
    fiatCurrency: string;
    updatedAt: Date;
}

export const mockActiveOrders: ActiveOrderMock[] = [
    {
        id: 'mock-order-1',
        role: 'BUYING',
        status: 'FUNDING',
        assetAmount: '124.67',
        assetCode: 'USDC',
        paymentMethod: 'Visa transfer',
        counterpartyName: 'Alex White',
        unitPrice: '1.012',
        fiatCurrency: 'USD',
        updatedAt: new Date(),
    },
    {
        id: 'mock-order-2',
        role: 'BUYING',
        status: 'FUNDING',
        assetAmount: '124.67',
        assetCode: 'USDC',
        paymentMethod: 'Visa transfer',
        counterpartyName: 'Alex White',
        unitPrice: '1.012',
        fiatCurrency: 'USD',
        updatedAt: new Date(),
    },
    {
        id: 'mock-order-3',
        role: 'BUYING',
        status: 'FUNDING',
        assetAmount: '124.67',
        assetCode: 'USDC',
        paymentMethod: 'Visa transfer',
        counterpartyName: 'Alex White',
        unitPrice: '1.012',
        fiatCurrency: 'USD',
        updatedAt: new Date(),
    },
];
