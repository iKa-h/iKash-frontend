"use client"

type walletProps = {
    balance: number
}

const assets = [
    {
        symbol: "XLM",
        name: "STELLAR LUMENS",
        amount: "1,245.00",
        change: "+2.4%",
        positive: true,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" stroke="#8ecdf7" strokeWidth="1.5" />
                <path d="M6 12h12M12 6l6 6-6 6" stroke="#8ecdf7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        bg: "bg-[#1a2a3a]",
    },
    {
        symbol: "BTC",
        name: "BITCOIN",
        amount: "0.45",
        change: "-1.2%",
        positive: false,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" stroke="#f7931a" strokeWidth="1.5" />
                <path d="M9 7h4.5a2 2 0 010 4H9m0 0h5a2 2 0 010 4H9M9 7V5m0 14v-2m3-12v2m0 10v2" stroke="#f7931a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        bg: "bg-[#2a1a0a]",
    },
    {
        symbol: "ETH",
        name: "ETHEREUM",
        amount: "4.12",
        change: "+5.8%",
        positive: true,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" stroke="#627eea" strokeWidth="1.5" />
                <path d="M12 4l-5 8.5L12 15l5-2.5L12 4zM7 12.5L12 20l5-7.5-5 3-5-3z" stroke="#627eea" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
        ),
        bg: "bg-[#0f1a2e]",
    },
];

export function WalletDashboard({balance}: walletProps) {
    return (
        <div className="w-[1232px] h-[984px] border-r border-[#1F2937] pt-12">
            <div
                className="relative rounded-2xl overflow-hidden p-8 w-[1136] h-[218]"
                style={{
                    background: "linear-gradient(135deg, #1a1a1a 0%, #1f2a1a 60%, #2a3a1a 100%)",
                    boxShadow: "0 0 60px rgba(188,237,9,0.08)",
                }}
            >
                <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
                    style={{
                        background: "radial-gradient(circle, #bced09 0%, transparent 70%)",
                        transform: "translate(30%, -30%)",
                    }}
                />

                <p className="text-[14px] tracking-[1.4px] text-[#8F8389] uppercase">
                    Total Balance
                </p>

                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-[72px] font-bold text-white tracking-tight">
                                {balance}
                            </span>
                            <span className="text-[#8F8389] text-[24px] tracking-[-3.6px]">USD</span>
                        </div>
                        <div className="flex items-center gap-1 mt-3">
                            <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none">
                                <path d="M2 7L5 3l3 4" stroke="#bced09" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="text-[#bced09] text-xs tracking-wide">+12.5% this month</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-[#bced09] hover:bg-[#d4f53a] text-black text-xs font-bold px-5 py-3 rounded-xl tracking-wider transition-all duration-200 hover:scale-105 active:scale-95">
                            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none">
                                <path d="M2 12L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            SEND
                        </button>
                        <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] text-white text-xs font-bold px-5 py-3 rounded-xl tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 border border-[#3a3a3a]">
                            <svg viewBox="0 0 14 14" className="w-3.5 h-3.5" fill="none">
                                <path d="M12 2L2 12M2 12H9M2 12V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            RECEIVE
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-[1136] h-[218]">
                <div className="flex justify-between items-center mb-4 mt-4 px-1">
                    <span className="text-white font-bold text-base tracking-wide">Assets</span>
                    <button className="text-[#bced09] text-xs tracking-wider hover:text-[#d4f53a] transition-colors">
                        View all →
                    </button>
                </div>

                <div className="space-y-2">
                    {assets.map((asset) => (
                        <div
                            key={asset.symbol}
                            className="flex items-center justify-between p-4 rounded-xl bg-[#161618] border border-[#1f1f1f] hover:border-[#2a2a2a] hover:bg-[#181818] transition-all duration-200 cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full ${asset.bg} flex items-center justify-center border border-[#2a2a2a]`}>
                                    {asset.icon}
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm tracking-wide">{asset.symbol}</p>
                                    <p className="text-[#4b5563] text-[10px] tracking-[0.15em]">{asset.name}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-white font-bold text-sm tabular-nums">{asset.amount}</p>
                                <p className={`text-[11px] font-medium tabular-nums ${asset.positive ? "text-[#bced09]" : "text-[#ef4444]"}`}>
                                    {asset.change}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}