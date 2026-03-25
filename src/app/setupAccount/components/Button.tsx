'use client';

import { ButtonProps } from "../utils/ButtonProps";

export function Button({ text }: ButtonProps) {
    return (
        <button type="submit" className='bg-[#BCED09] uppercase w-150 h-17 rounded-xl text-[18px] font-black text-[#010308]'>
            {text}
        </button>
    );
}