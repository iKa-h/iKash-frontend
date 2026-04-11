'use client';

export function CreateOfferModal(isOpen: boolean) {

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-end"
                    onClick={() => isOpen = false} // cierra al clickear afuera
                >
                    {/* Modal */}
                    <div
                        className="bg-[#1a1d27] h-full w-80 p-8 border-r border-white/10"
                        onClick={(e) => e.stopPropagation()} // evita cerrar al clickear adentro
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white text-lg font-semibold">Título del Modal</h2>
                            <button
                                onClick={() => isOpen = false}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px mb-6" style={{ background: 'linear-gradient(to right, #BCED0900, #BCED09, #BCED0900)' }} />

                        {/* Content */}
                        <p className="text-gray-400 text-sm mb-6">
                            Este es el contenido del modal. Puedes poner aquí formularios, información, confirmaciones, etc.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => isOpen = false}
                                className="flex-1 border border-white/10 text-gray-400 font-semibold px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => isOpen = false}
                                className="flex-1 bg-[#4ade80] text-black font-semibold px-4 py-3 rounded-xl hover:bg-[#22c55e] transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}