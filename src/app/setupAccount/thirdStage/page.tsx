'use client';

import Image from 'next/image'

import preferencesIcon from '../../../../public/preferences-icon.svg'
import arrow from '../../../../public/down-arrow.svg'
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { useState } from 'react';
import banks from './utils/banks';
import { Button } from '../components/Button';
import { Line } from '../components/Line';

export default function ThirdStage() {
    const nav = useRouter();
    const [currency, setCurrency] = useState(banks[0]);
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        nav.push('/setupAccount/thirdStage');
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-6">
            <Line />
            <Header />
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className="bg-[#12141A] rounded-2xl p-6 flex flex-col gap-6 w-150">
                    <div className='flex flex-col items-end p-0 -m-3'>
                        <section className='flex w-[134.5px] items-center justify-center h-5.5 rounded-full bg-[#BCED091A] border border-[#BCED0933]'>
                            <p className='font-bold text-[#BCED09] uppercase text-[10px]'>Recommended for P2P</p>
                        </section>
                    </div>
                    <div className="flex flex-col items-start gap-2">
                        <div className='flex gap-3'>
                            <Image
                                src={preferencesIcon}
                                width={20}
                                height={20}
                                alt='icono de profile details'
                            />
                            <p className="text-[#F1F5F9] font-bold text-[20px]">3. Optional P2P Setup</p>
                        </div>
                        <p className='text-[14px] text-[#94A3B8]'>Add your primary payment method to start peer-to-peer trading.</p>
                    </div>

                    <div className="relative">
                        <p className="text-[#CBD5E1] text-sm font-semibold mb-2 px-1">Payment Method</p>
                        <div
                            className="relative bg-[#01030880] border border-[#343434] rounded-xl px-5 py-4 cursor-pointer"
                            onClick={() => setOpen(!open)}
                        >
                            <span className="text-[#F1F5F9] text-[16px]">{currency}</span>
                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Image src={arrow} width={24} height={24} alt="flecha del select" />
                            </div>
                        </div>
                        {open && (
                            <div className="absolute z-10 w-full mt-1 bg-[#1a1d27] rounded-xl overflow-hidden border border-white/10">
                                {banks.map((c) => (
                                    <div
                                        key={c}
                                        onClick={() => {
                                            setCurrency(c);
                                            setOpen(false);
                                        }}
                                        className={`px-5 py-3 text-[16px] cursor-pointer hover:bg-white/10 transition-colors
                        ${currency === c ? 'text-[#BCED09]' : 'text-[#F1F5F9]'}`}
                                    >
                                        {c}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[#CBD5E1] font-semibold text-sm">Account Holder Name</label>
                        <input
                            type="text"
                            placeholder="Full Legal Name"
                            className="bg-[#01030880] text-[#6B7280] text-[16px] rounded-xl px-4 py-3 outline-none border border-[#343434] focus:border-gray-600"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[#CBD5E1] font-semibold text-sm">IBAN / Account Number</label>
                        <input
                            type="text"
                            placeholder="EX00 0000 0000..."
                            className="bg-[#01030880] text-[#6B7280] text-[16px] rounded-xl px-4 py-3 outline-none border border-[#343434] focus:border-gray-600"
                        />
                    </div>

                </div>
                <div>
                    <Button text='Complete setup' />
                </div>
            </form>
            <Line />
        </div>
    );
}