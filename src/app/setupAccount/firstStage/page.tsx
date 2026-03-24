'use client'

import Image from 'next/image'

import userIcon from '../../../../public/user-icon-selected.svg'
import { Header } from '../components/Header'
import { useRouter } from 'next/navigation'

export default function FirstStage() {
    const nav = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        nav.push('/setupAccount/secondStage');
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-6">
            <Header />
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className="bg-[#12141A] rounded-2xl p-6 flex flex-col gap-6 w-150">
                    <div className="flex items-center gap-2">
                        <Image
                            src={userIcon}
                            width={20}
                            height={20}
                            alt='icono de profile details'
                        />
                        <p className="text-[#F1F5F9] font-bold text-[20px]">1. Profile Details</p>
                    </div>


                    <div className="flex flex-col gap-1">
                        <label className="text-[#CBD5E1] font-semibold text-sm">Username</label>
                        <input
                            type="text"
                            placeholder="e.g. Satoshi_Master"
                            className="bg-[#01030880] text-[#6B7280] text-[16px] rounded-xl px-4 py-3 outline-none border border-[#343434] focus:border-gray-600"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[#CBD5E1] font-semibold text-sm">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@ika$h.io"
                            className="bg-[#01030880] text-[#6B7280] text-[16px] rounded-xl px-4 py-3 outline-none border border-[#343434] focus:border-gray-600"
                        />
                    </div>
                </div>
                <button type="submit" className='bg-[#BCED09] uppercase w-150 h-17 rounded-xl text-[20px] font-bold text-[#010308]'>Next Step</button>
            </form>
        </div>
    );
}