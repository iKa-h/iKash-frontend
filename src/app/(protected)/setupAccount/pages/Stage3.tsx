'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import preferencesIcon from '../../../../../public/preferences-icon.svg'
import arrow from '../../../../../public/down-arrow.svg'
import { Button } from '../components/Button'
import { SetupAccountPayload } from '../../../../features/user/models/setupAccount'
import { usePaymentProviders, PaymentProvider } from '../../../../features/paymentMethod/hooks/usePaymentProviders'

interface Stage3Props {
    onFinish: (data: Partial<SetupAccountPayload>) => void;
}

type ProviderType = 'MOBILE' | 'PLATFORM' | 'BANK';

export default function Stage3({ onFinish }: Stage3Props) {
    const { providers, loading } = usePaymentProviders();
    
    // UI State
    const [selectedType, setSelectedType] = useState<ProviderType>('BANK');
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
    const [dynamicFields, setDynamicFields] = useState<Record<string, string>>({});
    const [isProviderListOpen, setIsProviderListOpen] = useState(false);

    // Filtered providers based on type
    const filteredProviders = useMemo(() => {
        return providers.filter(p => p.type === selectedType);
    }, [providers, selectedType]);

    // Reset provider if type changes
    useEffect(() => {
        setSelectedProvider(null);
        setDynamicFields({});
    }, [selectedType]);

    const handleFieldChange = (field: string, value: string) => {
        setDynamicFields(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProvider) return;

        onFinish({
            providerId: selectedProvider.provider_id,
            accountIdentifier: dynamicFields['account_identifier'],
            identificationNumber: dynamicFields['identification_number'],
            beneficiaryName: dynamicFields['beneficiary_name'],
            description: dynamicFields['description']
        });
    }

    if (loading) return <div className="text-white text-center">Loading providers...</div>;

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <div className="bg-[#12141A] rounded-2xl p-6 flex flex-col gap-6 w-150">
                <div className='flex flex-col items-end p-0 -m-3'>
                    <section className='flex w-[134.5px] items-center justify-center h-5.5 rounded-full bg-[#BCED091A] border border-[#BCED0933]'>
                        <p className='font-bold text-[#BCED09] uppercase text-[10px]'>Recommended for P2P</p>
                    </section>
                </div>
                
                <div className="flex flex-col items-start gap-2">
                    <div className='flex gap-3'>
                        <Image src={preferencesIcon} width={20} height={20} alt='p2p setup icon' />
                        <p className="text-[#F1F5F9] font-bold text-[20px]">3. Optional P2P Setup</p>
                    </div>
                    <p className='text-[14px] text-[#94A3B8]'>Add your primary payment method to start peer-to-peer trading.</p>
                </div>

                {/* 1. Category Slider/Tabs */}
                <div className="flex flex-col gap-2">
                    <p className="text-[#CBD5E1] text-sm font-semibold px-1">Method Classification</p>
                    <div className="flex bg-[#01030880] p-1 rounded-xl border border-[#343434]">
                        {(['BANK', 'PLATFORM', 'MOBILE'] as ProviderType[]).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSelectedType(type)}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                                    selectedType === type 
                                    ? 'bg-[#BCED09] text-[#12141A]' 
                                    : 'text-[#94A3B8] hover:text-white'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Provider Selector */}
                <div className="relative">
                    <p className="text-[#CBD5E1] text-sm font-semibold mb-2 px-1">Select Provider</p>
                    <div
                        className="relative bg-[#01030880] border border-[#343434] rounded-xl px-5 py-4 cursor-pointer"
                        onClick={() => setIsProviderListOpen(!isProviderListOpen)}
                    >
                        <span className="text-[#F1F5F9] text-[16px]">
                            {selectedProvider ? selectedProvider.name : `Select a ${selectedType.toLowerCase()} provider...`}
                        </span>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                            <Image src={arrow} width={24} height={24} alt="arrow" className={isProviderListOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                        </div>
                    </div>
                    {isProviderListOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-[#1a1d27] rounded-xl overflow-y-auto border border-white/10 shadow-2xl max-h-[280px]">
                            {filteredProviders.length > 0 ? (
                                filteredProviders.map((p) => (
                                    <div
                                        key={p.provider_id}
                                        onClick={() => { setSelectedProvider(p); setIsProviderListOpen(false); }}
                                        className={`px-5 py-3 text-[16px] cursor-pointer hover:bg-white/10 transition-colors ${selectedProvider?.provider_id === p.provider_id ? 'text-[#BCED09]' : 'text-[#F1F5F9]'}`}
                                    >
                                        {p.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-5 py-3 text-[#94A3B8] text-sm italic text-center">No providers found for this category.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. Dynamic Fields with Animation */}
                {selectedProvider && (
                    <div className="flex flex-col gap-5 animate-slide-down overflow-hidden origin-top">
                        {selectedProvider.metadata.ui_requirements.map((req) => (
                            <div key={req.db_field} className="flex flex-col gap-1">
                                <label className="text-[#CBD5E1] font-semibold text-sm">
                                    {req.label} {req.required && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type={req.type}
                                    value={dynamicFields[req.db_field] || ''}
                                    onChange={(e) => handleFieldChange(req.db_field, e.target.value)}
                                    placeholder={req.placeholder}
                                    required={req.required}
                                    className="bg-[#01030880] text-[#F1F5F9] text-[16px] rounded-xl px-4 py-3 outline-none border border-[#343434] focus:border-[#BCED09] transition-all"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <Button 
                text='Complete setup' 
                disabled={!selectedProvider || selectedProvider.metadata.ui_requirements.some(r => r.required && !dynamicFields[r.db_field])}
            />

            <style jsx>{`
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-20px); max-height: 0; }
                    to { opacity: 1; transform: translateY(0); max-height: 500px; }
                }
                .animate-slide-down {
                    animation: slide-down 0.4s ease-out forwards;
                }
            `}</style>
        </form>
    );
}
