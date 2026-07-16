export interface PaymentProviderField {
    key: string;
    label: string;
    type: string;
    required: boolean;
    placeholder?: string;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    errorMessage?: string;
}

export interface PaymentProvider {
    id: string;
    name: string;
    type: string;
    country: string | null;
    requiredFields: PaymentProviderField[];
}
