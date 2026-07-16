import { describe, expect, it } from 'vitest';
import { PaymentProvider } from '../types/paymentProvider';
import { validatePaymentDetails } from './paymentMethod.validation';

const provider: PaymentProvider = {
    id: 'sinpe', name: 'SINPE Móvil', type: 'MOBILE', country: 'CR',
    requiredFields: [{ key: 'phoneNumber', label: 'Phone number', type: 'tel', required: true }],
};

describe('validatePaymentDetails', () => {
    it('requires configured fields', () => {
        expect(validatePaymentDetails(provider, {})).toEqual({ phoneNumber: 'Phone number is required.' });
    });

    it('validates Costa Rican phone numbers', () => {
        expect(validatePaymentDetails(provider, { phoneNumber: '123' }).phoneNumber).toContain('Costa Rican');
        expect(validatePaymentDetails(provider, { phoneNumber: '+506 8888-8888' })).toEqual({});
    });

    it('validates email and IBAN fields by metadata key', () => {
        const configured = {
            ...provider, country: null,
            requiredFields: [
                { key: 'email', label: 'Email', type: 'email', required: true },
                { key: 'iban', label: 'IBAN', type: 'text', required: true },
            ],
        };
        expect(validatePaymentDetails(configured, { email: 'bad', iban: 'bad' })).toHaveProperty('email');
        expect(validatePaymentDetails(configured, { email: 'a@b.com', iban: 'GB82 WEST 1234 5698 7654 32' })).toEqual({});
    });
});
