"use client";

import React from "react";

export function TradingVolume() {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Title & Dropdown */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-black text-[20px] tracking-[-0.6px] uppercase">Trading Volume</h3>
          <p className="text-xs text-[#8F8389] mt-0.5">24h performance</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#161618] border border-[#1F2937] hover:border-[#343434] text-xs text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-colors">
          <span>Daily</span>
          <span className="text-[#8F8389] text-[10px]">▼</span>
        </div>
      </div>

      {/* SVG Chart Card */}
      <div className="bg-[#161618] border border-[#1F2937] rounded-3xl p-6 flex flex-col gap-4">
        <div className="w-full h-[150px] relative mt-2">
          <svg className="w-full h-[110px]" viewBox="0 0 300 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#BCED09" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#BCED09" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* The Gradient Area under the curve */}
            <path
              d="M 0 65 Q 40 65 70 30 T 110 70 T 170 75 T 230 70 Q 260 50 300 10 L 300 100 L 0 100 Z"
              fill="url(#chartGradient)"
            />
            {/* The Line */}
            <path
              d="M 0 65 Q 40 65 70 30 T 110 70 T 170 75 T 230 70 Q 260 50 300 10"
              fill="none"
              stroke="#BCED09"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Timeline labels */}
          <div className="flex justify-between items-center text-[10px] text-[#4b5563] font-bold tracking-wider mt-4 px-1">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:59</span>
          </div>
        </div>
      </div>
    </div>
  );
}
