'use client'

import { useCallback, useEffect, useState } from 'react';
import { getPaymentProviders } from '../application/paymentProvider.service';
import { PaymentProvider } from '../types/paymentProvider';

export function usePaymentProviders(country?: string) {
    const [providers, setProviders] = useState<PaymentProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const retry = useCallback(() => setReloadKey(key => key + 1), []);

    useEffect(() => {
        const controller = new AbortController();
        Promise.resolve().then(() => {
            if (controller.signal.aborted) return [];
            setLoading(true);
            setError(null);
            return getPaymentProviders(country, controller.signal);
        })
            .then(result => {
                if (controller.signal.aborted) return;
                const expected = country?.toUpperCase();
                setProviders(result.filter(provider => !expected || !provider.country || provider.country === expected));
            })
            .catch((reason: unknown) => {
                if (reason instanceof DOMException && reason.name === 'AbortError') return;
                setProviders([]);
                setError(reason instanceof Error ? reason.message : 'Unable to load payment providers.');
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [country, reloadKey]);

    return { providers, loading, error, retry };
}

export type { PaymentProvider } from '../types/paymentProvider';
