'use client';

interface WalletBalanceCardProps {
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  currency?: string;
}

export function WalletBalanceCard({ balance, isLoading, error, currency = 'XLM' }: WalletBalanceCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl p-6 md:p-8 w-full mb-8 bg-[#1a1a1a] animate-pulse">
        <div className="h-4 w-24 bg-[#2a2a2a] rounded mb-4" />
        <div className="h-12 w-48 bg-[#2a2a2a] rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 md:p-8 w-full mb-8 bg-[#1a1a1a] border border-red-900/50">
        <p className="text-red-400 text-sm">Failed to load balance</p>
        <p className="text-[#8F8389] text-xs mt-1">{error}</p>
      </div>
    );
  }

  const displayBalance = balance || '0.00';
  const formattedBalance = parseFloat(displayBalance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-5 md:p-8 w-full mb-8 shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #1f2a1a 60%, #2a3a1a 100%)',
        boxShadow: '0 0 60px rgba(188,237,9,0.08)',
      }}
    >
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #bced09 0%, transparent 70%)',
          transform: 'translate(30%, -30%)',
        }}
      />
      <p className="text-[14px] tracking-[1.4px] text-[#8F8389] uppercase mb-2">TOTAL BALANCE</p>
      <div className="flex items-baseline gap-3">
        <span className="text-[40px] md:text-[72px] font-bold text-white tracking-tight">
          {formattedBalance}
        </span>
        <span className="text-[#8F8389] text-[18px] md:text-[24px]">{currency}</span>
      </div>
    </div>
  );
}
