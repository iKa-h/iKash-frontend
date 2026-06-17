'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, ArrowLeftRight, Database, Settings } from 'lucide-react';

const links = [
    { href: '/dashboard', label: 'Home', icon: LayoutGrid },
    { href: '/p2p', label: 'P2P', icon: ArrowLeftRight },
    { href: '/transactions', label: 'Transactions', icon: Database },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50">
            {/* Curved background for active tab */}
            <div className="relative bg-[#161618] border-t border-[#1F2937]">
                {/* SVG Curve for the active tab highlight */}
                <svg 
                    className="absolute top-0 left-0 right-0 h-8 text-[#161618]" 
                    viewBox="0 0 100 20" 
                    preserveAspectRatio="none"
                    style={{ transform: 'translateY(-100%)' }}
                >
                    <path 
                        d="M0,20 Q25,20 25,0 L75,0 Q75,20 100,20 Z" 
                        fill="currentColor"
                    />
                </svg>
                
                <div className="flex items-center justify-around pt-4 pb-6">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        const IconComponent = link.icon;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex flex-col items-center gap-1 px-4 py-2 transition-all duration-300 ease-in-out relative
                                ${isActive
                                    ? 'text-[#010308] font-bold'
                                    : 'text-[#8F8389] font-medium hover:text-white'
                                }`}
                            >
                                {isActive && (
                                    <div className="absolute -top-6 w-16 h-16 bg-[#BCED09] rounded-full flex items-center justify-center shadow-lg">
                                        <IconComponent size={28} strokeWidth={2.5} />
                                    </div>
                                )}
                                {!isActive && (
                                    <IconComponent size={24} strokeWidth={2} />
                                )}
                                <span className={`text-xs ${isActive ? 'text-[#BCED09] mt-4' : ''}`}>{link.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    )
}
