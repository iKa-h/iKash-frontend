'use client';

import Image from 'next/image';

interface WalletAssetRowProps {
  code: string;
  name: string;
  balance: string;
  icon?: string;
}

export function WalletAssetRow({ code, name, balance, icon }: WalletAssetRowProps) {
  const formattedBalance = parseFloat(balance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#161618] border border-[#1f1f1f] hover:border-[#2a2a2a] hover:bg-[#181818] transition-all duration-200 cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#1a2a3a] flex items-center justify-center border border-[#2a2a2a] text-white font-bold text-xs overflow-hidden shrink-0">
          {icon ? (
            <Image src={icon} alt={code} width={40} height={40} className="w-full h-full object-cover" />
          ) : (
            code.slice(0, 3)
          )}
        </div>
        <div>
          <p className="text-white font-bold text-sm tracking-wide">{code}</p>
          <p className="text-[#4b5563] text-[10px] tracking-[0.15em] uppercase">{name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-white font-bold text-sm tabular-nums">{formattedBalance}</p>
      </div>
    </div>
  );
}
