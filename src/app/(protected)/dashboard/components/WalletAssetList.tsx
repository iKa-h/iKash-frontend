'use client';

import { WalletAssetRow } from './WalletAssetRow';
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
        <WalletAssetRow
          key={asset.code + '-' + index}
          code={asset.code}
          name={asset.name}
          balance={asset.balance}
          icon={asset.icon}
        />
      ))}
    </div>
  );
}
