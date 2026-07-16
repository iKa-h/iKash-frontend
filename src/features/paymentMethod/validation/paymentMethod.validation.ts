import { PaymentProvider, PaymentProviderField } from '../types/paymentProvider';

export type PaymentFieldErrors = Record<string, string>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IBAN = /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/;
const CR_PHONE = /^(?:\+?506)?[2-8]\d{7}$/;
const CPF = /^\d{11}$/;
const PIX_RANDOM_KEY = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function knownFormatError(field: PaymentProviderField, value: string, provider: PaymentProvider): string | null {
    const key = field.key.toLowerCase();
    const compact = value.replace(/[\s().-]/g, '');
    if ((field.type === 'email' || key.includes('email')) && !EMAIL.test(value)) return 'Enter a valid email address.';
    if (key.includes('iban') && !IBAN.test(value.replace(/\s/g, '').toUpperCase())) return 'Enter a valid IBAN.';
    if ((key.includes('phone') || field.type === 'tel') && provider.country === 'CR' && !CR_PHONE.test(compact)) {
        return 'Enter a valid Costa Rican phone number.';
    }
    if (key.includes('pix')) {
        const validPix = EMAIL.test(value) || /^\+?\d{10,15}$/.test(compact) || CPF.test(compact) || PIX_RANDOM_KEY.test(value);
        if (!validPix) return 'Enter a valid Pix key (CPF, email, phone, or random key).';
    }
    return null;
}

export function validatePaymentField(field: PaymentProviderField, rawValue: string, provider: PaymentProvider): string | null {
    const value = rawValue.trim();
    if (!value) return field.required ? `${field.label} is required.` : null;
    if (field.minLength && value.length < field.minLength) return field.errorMessage ?? `${field.label} is too short.`;
    if (field.maxLength && value.length > field.maxLength) return field.errorMessage ?? `${field.label} is too long.`;
    if (field.pattern) {
        try {
            if (!new RegExp(field.pattern).test(value)) return field.errorMessage ?? `Enter a valid ${field.label.toLowerCase()}.`;
        } catch {
            return 'This payment field is not configured correctly.';
        }
    }
    return knownFormatError(field, value, provider);
}

export function validatePaymentDetails(provider: PaymentProvider | null, values: Record<string, string>): PaymentFieldErrors {
    if (!provider) return { provider: 'Select a payment provider.' };
    return Object.fromEntries(provider.requiredFields.flatMap(field => {
        const error = validatePaymentField(field, values[field.key] ?? '', provider);
        return error ? [[field.key, error]] : [];
    }));
}
