'use client';

import { useOffers } from '@/features/offer/hooks/useOffers';
import { useUsdcPrice } from '@/features/market-data/hooks/useUsdcPrice';

export function MarketSnapshot() {
  const { offers, isLoading: offersLoading } = useOffers();
  const { price, isLoading: priceLoading, error, isStale, lastUpdated } = useUsdcPrice();

  const buyOffers = offers.filter((o) => o.type === 'buy').length;
  const sellOffers = offers.filter((o) => o.type === 'sell').length;

  return (
    <div className="w-full rounded-2xl bg-[#161618] border border-[#1f1f1f] p-5 md:p-6">
      <h3 className="text-white font-bold text-base tracking-wide mb-4">Market Snapshot</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-[#0d0d0f] p-4">
          <p className="text-[#8F8389] text-xs tracking-wider uppercase mb-1">Buy Offers</p>
          <p className="text-white font-bold text-2xl tabular-nums">
            {offersLoading ? '...' : buyOffers}
          </p>
        </div>
        <div className="rounded-xl bg-[#0d0d0f] p-4">
          <p className="text-[#8F8389] text-xs tracking-wider uppercase mb-1">Sell Offers</p>
          <p className="text-white font-bold text-2xl tabular-nums">
            {offersLoading ? '...' : sellOffers}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-[#0d0d0f] p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[#8F8389] text-xs tracking-wider uppercase">USDC Price</p>
          {isStale && (
            <span className="text-[#f0a020] text-[10px] tracking-wider">Stale data</span>
          )}
        </div>
        {priceLoading && price === null ? (
          <div className="h-8 w-28 bg-[#2a2a2a] rounded animate-pulse" />
        ) : error && price === null ? (
          <p className="text-red-400 text-sm">Price unavailable</p>
        ) : (
          <p className="text-white font-bold text-2xl tabular-nums">
            {price?.toFixed(4)} <span className="text-[#8F8389] text-sm font-normal">USD</span>
          </p>
        )}
        {isStale && price !== null && (
          <p className="text-[#8F8389] text-[10px] mt-1">
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'unknown'}
          </p>
        )}
      </div>
    </div>
  );
}
