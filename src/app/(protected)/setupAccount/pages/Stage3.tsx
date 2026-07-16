'use client'

import { useState } from 'react'
import { Button } from '../components/Button'
import { SetupAccountPayload } from '../../../../features/user/models/setupAccount'
import { usePaymentProviders } from '../../../../features/paymentMethod/hooks/usePaymentProviders'
import { PaymentProvider } from '../../../../features/paymentMethod/types/paymentProvider'
import { validatePaymentDetails } from '../../../../features/paymentMethod/validation/paymentMethod.validation'

interface Props {
    country?: string;
    onFinish: (data: Partial<SetupAccountPayload>) => Promise<string | null>;
}

export default function Stage3({ country, onFinish }: Props) {
    const { providers, loading, error: loadError, retry } = usePaymentProviders(country);
    const [provider, setProvider] = useState<PaymentProvider | null>(null);
    const [values, setValues] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const errors = validatePaymentDetails(provider, values);
    const invalidConfig = provider?.requiredFields.length === 0;
    const valid = Boolean(provider && !invalidConfig && Object.keys(errors).length === 0);

    const selectProvider = (id: string) => {
        setProvider(providers.find(item => item.id === id) ?? null);
        setValues({});
        setTouched({});
        setSubmitted(false);
        setSubmitError(null);
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitted(true);
        if (!provider || !valid || saving) return;
        setSaving(true);
        setSubmitError(null);
        const metadata = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value.trim()]));
        const payload: Partial<SetupAccountPayload> = { providerId: provider.id, metadata };
        const aliases: Record<string, keyof SetupAccountPayload> = {
            account_identifier: 'accountIdentifier', accountIdentifier: 'accountIdentifier',
            identification_number: 'identificationNumber', identificationNumber: 'identificationNumber',
            beneficiary_name: 'beneficiaryName', beneficiaryName: 'beneficiaryName',
            account_holder_name: 'beneficiaryName', accountHolderName: 'beneficiaryName',
            description: 'description',
        };
        Object.entries(metadata).forEach(([key, value]) => {
            if (aliases[key]) Object.assign(payload, { [aliases[key]]: value });
        });
        payload.accountIdentifier = payload.accountIdentifier ?? metadata.phoneNumber ?? metadata.email ?? metadata.iban ?? metadata.pixKey;
        try {
            setSubmitError(await onFinish(payload));
        } catch {
            setSubmitError('A network error occurred. Your details are still here; please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={submit} className={'flex w-full max-w-[600px] flex-col gap-8'} noValidate>
            <div className={'flex flex-col gap-6 rounded-2xl bg-[#12141A] p-6'}>
                <div><h2 className={'text-xl font-bold text-white'}>3. Optional P2P Setup</h2><p className={'mt-2 text-sm text-[#94A3B8]'}>Add your primary payment method to start peer-to-peer trading.</p></div>
                <div aria-live={'polite'}>
                    {loading && <p>Loading payment providers...</p>}
                    {loadError && <div role={'alert'}><p>{loadError}</p><button type={'button'} onClick={retry} className={'underline'}>Try again</button></div>}
                    {!loading && !loadError && providers.length === 0 && <p role={'status'}>No payment methods are currently available for your country. Please try again later.</p>}
                </div>
                {!loading && !loadError && providers.length > 0 && <>
                    <div>
                        <label htmlFor={'payment-provider'}>Payment provider <span aria-hidden={'true'}>*</span></label>
                        <select id={'payment-provider'} required value={provider?.id ?? ''} onChange={event => selectProvider(event.target.value)}
                            aria-invalid={submitted && !provider} aria-describedby={submitted && !provider ? 'provider-error' : undefined}
                            className={'mt-2 w-full rounded-xl border border-[#343434] bg-[#090b11] px-4 py-3 text-white'}>
                            <option value={''}>Select a provider...</option>
                            {providers.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </select>
                        {submitted && !provider && <p id={'provider-error'} role={'alert'} className={'text-red-400'}>Select a payment provider.</p>}
                    </div>
                    {provider && <div className={'flex flex-col gap-5'}>
                        {invalidConfig && <p role={'alert'} className={'text-red-400'}>This provider is not configured correctly. Select another provider.</p>}
                        {provider.requiredFields.map(field => {
                            const error = errors[field.key];
                            const show = Boolean(error && (touched[field.key] || submitted));
                            const id = `payment-${field.key.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
                            return <div key={field.key}>
                                <label htmlFor={id}>{field.label} {field.required ? <><span aria-hidden={'true'}>*</span><span className={'sr-only'}>(required)</span></> : <span>(optional)</span>}</label>
                                <input id={id} type={field.type} value={values[field.key] ?? ''} placeholder={field.placeholder}
                                    onChange={event => setValues(current => ({ ...current, [field.key]: event.target.value }))}
                                    onBlur={() => setTouched(current => ({ ...current, [field.key]: true }))}
                                    required={field.required} minLength={field.minLength} maxLength={field.maxLength}
                                    aria-invalid={show} aria-describedby={show ? `${id}-error` : undefined}
                                    className={'mt-1 w-full rounded-xl border border-[#343434] bg-[#01030880] px-4 py-3 text-white'} />
                                {show && <p id={`${id}-error`} role={'alert'} className={'text-red-400'}>{error}</p>}
                            </div>;
                        })}
                    </div>}
                </>}
                {submitError && <p role={'alert'} className={'text-red-400'}>{submitError}</p>}
            </div>
            <Button text={saving ? 'Saving...' : 'Complete setup'} disabled={loading || Boolean(loadError) || !valid || saving} />
        </form>
    );
}
