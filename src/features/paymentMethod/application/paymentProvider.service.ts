import { PaymentProvider, PaymentProviderField } from '../types/paymentProvider';

type UnknownRecord = Record<string, unknown>;
const asRecord = (value: unknown): UnknownRecord =>
    value !== null && typeof value === 'object' ? value as UnknownRecord : {};

function normalizeField(value: unknown): PaymentProviderField | null {
    const field = asRecord(value);
    const key = field.key ?? field.db_field ?? field.name;
    if (typeof key !== 'string' || typeof field.label !== 'string') return null;
    const pattern = field.pattern ?? field.validation_pattern;
    const minLength = field.minLength ?? field.min_length;
    const maxLength = field.maxLength ?? field.max_length;
    const errorMessage = field.errorMessage ?? field.error_message;
    return {
        key, label: field.label,
        type: typeof field.type === 'string' ? field.type : 'text',
        required: field.required === true,
        placeholder: typeof field.placeholder === 'string' ? field.placeholder : undefined,
        pattern: typeof pattern === 'string' ? pattern : undefined,
        minLength: typeof minLength === 'number' ? minLength : undefined,
        maxLength: typeof maxLength === 'number' ? maxLength : undefined,
        errorMessage: typeof errorMessage === 'string' ? errorMessage : undefined,
    };
}

function normalizeProvider(value: unknown): PaymentProvider | null {
    const provider = asRecord(value);
    const metadata = asRecord(provider.metadata);
    const id = provider.id ?? provider.provider_id;
    const rawFields = provider.requiredFields ?? provider.required_fields ?? metadata.ui_requirements;
    if (typeof id !== 'string' || typeof provider.name !== 'string' ||
        typeof provider.type !== 'string' || !Array.isArray(rawFields)) return null;
    const country = provider.country ?? provider.country_code;
    return {
        id, name: provider.name, type: provider.type,
        country: typeof country === 'string' ? country.toUpperCase() : null,
        requiredFields: rawFields.map(normalizeField).filter((field): field is PaymentProviderField => field !== null),
    };
}

export async function getPaymentProviders(country?: string, signal?: AbortSignal): Promise<PaymentProvider[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) throw new Error('Payment service is not configured.');
    const query = country ? `?country=${encodeURIComponent(country)}` : '';
    const response = await fetch(`${apiUrl}/payment-providers${query}`, { signal });
    if (!response.ok) throw new Error('Unable to load payment providers. Please try again.');
    const body: unknown = await response.json();
    const record = asRecord(body);
    const list = Array.isArray(body) ? body : (record.data ?? record.providers);
    if (!Array.isArray(list)) throw new Error('The payment provider response is invalid.');
    return list.map(normalizeProvider).filter((provider): provider is PaymentProvider => provider !== null);
}
