import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Stage3 from './Stage3';

const hook = vi.fn();
vi.mock('../../../../features/paymentMethod/hooks/usePaymentProviders', () => ({
    usePaymentProviders: () => hook(),
}));

const providers = [
    { id: 'paypal', name: 'PayPal', type: 'PLATFORM', country: null, requiredFields: [{ key: 'email', label: 'Email', type: 'email', required: true }] },
    { id: 'bank', name: 'Bank', type: 'BANK', country: null, requiredFields: [{ key: 'iban', label: 'IBAN', type: 'text', required: true }] },
];

describe('Stage3', () => {
    beforeEach(() => hook.mockReturnValue({ providers, loading: false, error: null, retry: vi.fn() }));

    it('switches provider fields and clears incompatible values', () => {
        render(React.createElement(Stage3, { onFinish: vi.fn() }));
        fireEvent.change(screen.getByLabelText(/payment provider/i), { target: { value: 'paypal' } });
        fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'person@example.com' } });
        fireEvent.change(screen.getByLabelText(/payment provider/i), { target: { value: 'bank' } });
        expect(screen.queryByLabelText(/^Email/)).toBeNull();
        expect((screen.getByLabelText(/^IBAN/) as HTMLInputElement).value).toBe('');
    });

    it('submits trimmed valid details and preserves errors', async () => {
        const onFinish = vi.fn().mockResolvedValue('Duplicate payment method.');
        render(React.createElement(Stage3, { onFinish }));
        fireEvent.change(screen.getByLabelText(/payment provider/i), { target: { value: 'paypal' } });
        fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: ' person@example.com ' } });
        fireEvent.click(screen.getByRole('button', { name: /complete setup/i }));
        await waitFor(() => expect(onFinish).toHaveBeenCalledWith(expect.objectContaining({ providerId: 'paypal', accountIdentifier: 'person@example.com' })));
        expect((await screen.findByRole('alert')).textContent).toContain('Duplicate payment method.');
        expect((screen.getByLabelText(/^Email/) as HTMLInputElement).value).toBe('person@example.com');
    });
});
