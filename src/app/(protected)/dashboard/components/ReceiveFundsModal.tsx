import { CloseModalProps } from "@/app/utils/closeModalProps";

export function ReceiveFundsModal({ onClose }: CloseModalProps) {
    return (
        <div
            className="fixed inset-0 bg-[black/60] backdrop-blur-sm z-40 flex items-center justify-end"
            onClick={() => onClose()}
        >
            <div
                className="bg-[#0D1117F2] h-full w-md p-8 border-r border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <h2 className="text-white text-[30px] font-bold uppercase">Receive funds</h2>
                        <p className="text-[#C2C7D0] text-[14px]">Accept assets via Stellar Network.</p>
                    </div>
                    <button
                        onClick={() => onClose()}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="w-full h-px mb-6" style={{ background: 'linear-gradient(to right, #BCED0900, #BCED09, #BCED0900)' }} />

                <div className="flex items-center justify-center border w-98.75 h-72.25 rounded-lg">
                    <h1 className="text-5xl">QR</h1>
                </div>

                <div className="flex flex-col mt-3">
                    <p className="text-[#C2C7D0] text-[12px] mb-2 uppercase">ika$h alias</p>
                    <input type="text" placeholder="alex.ikash"
                        className="w-87.5 h-13 rounded-sm border border-[#45493233] bg-[#1B1B21] pl-3"
                    />
                </div>

                <div className="flex flex-col mt-3">
                    <p className="text-[#C2C7D0] text-[12px] mb-2 uppercase">stellar wallet id</p>
                    <input type="text" placeholder="GD36...IKASH"
                        className="w-87.5 h-13 rounded-sm border border-[#45493233] bg-[#1B1B21] pl-3"
                    />
                </div>

                <div className="flex w-full items-center justify-center gap-3 mt-10">
                    <button
                        onClick={() => onClose()}
                        className="flex-1 bg-[#BCED09] uppercase text-black font-semibold px-4 py-3 rounded-xl hover:bg-[#9ac208] transition-colors"
                    >
                        share details
                    </button>
                </div>
            </div>
        </div>
    );
}