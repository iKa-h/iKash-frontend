'use client';

import type { AssetBalance } from '@/features/wallet/presentation/hooks/useWalletBalance';

interface WalletAssetListProps {
  balances: AssetBalance[];
  isLoading: boolean;
  error: string | null;
}

function mapAssetToViewModel(asset: AssetBalance) {
  const isNative = asset.asset_type === 'native';
  return {
    code: isNative ? 'XLM' : (asset.asset_code || 'UNKNOWN'),
    name: isNative ? 'STELLAR LUMENS' : (asset.asset_code || 'UNKNOWN'),
    balance: asset.balance,
    icon: isNative ? '/xlm.png' : asset.asset_code === 'USDC' ? '/usdc.png' : undefined,
  };
}

export function WalletAssetList({ balances, isLoading, error }: WalletAssetListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-[#161618] animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a]" />
              <div className="flex-1">
                <div className="h-4 w-16 bg-[#2a2a2a] rounded mb-1" />
                <div className="h-3 w-24 bg-[#2a2a2a] rounded" />
              </div>
              <div className="h-4 w-20 bg-[#2a2a2a] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-[#161618] border border-red-900/50">
        <p className="text-red-400 text-sm">Failed to load assets</p>
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-[#161618]">
        <p className="text-[#8F8389] text-sm">No assets are currently available.</p>
      </div>
    );
  }

  const assets = balances.map(mapAssetToViewModel);

  return (
    <div className="space-y-2">
      {assets.map((asset, index) => (
        <div key={asset.code + '-' + index} className="flex items-center justify-between p-4 rounded-xl bg-[#161618] border border-[#1f1f1f] hover:border-[#2a2a2a] hover:bg-[#181818] transition-all duration-200 cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1a2a3a] flex items-center justify-center border border-[#2a2a2a] text-white font-bold text-xs overflow-hidden shrink-0">
              {asset.code.slice(0, 3)}
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wide">{asset.code}</p>
              <p className="text-[#4b5563] text-[10px] tracking-[0.15em] uppercase">{asset.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-sm tabular-nums">
              {parseFloat(asset.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 7 })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
