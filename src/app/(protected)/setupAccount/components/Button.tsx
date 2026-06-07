'use client';

import { ButtonProps } from "../utils/ButtonProps";

export function Button({ text, disabled }: ButtonProps) {
    return (
        <button 
            type="submit" 
            disabled={disabled}
            className={`uppercase w-150 h-17 rounded-xl text-[18px] font-black transition-all ${
                disabled 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-[#BCED09] text-[#010308] hover:bg-[#d4f53a]'
            }`}
        >
            {text}
        </button>
    );
}