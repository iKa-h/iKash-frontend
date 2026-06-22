'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useWallet } from '@/features/wallet'
import { useUser } from '@/features/user/presentation/context/UserContext'
import { LayoutGrid, ArrowLeftRight, Database, Settings } from 'lucide-react'
import { MobileBottomNav } from './MobileBottomNav'

const navLinks = [
    { href: '/dashboard', label: 'Home', icon: LayoutGrid },
    { href: '/p2p', label: 'P2P', icon: ArrowLeftRight },
    { href: '/transactions', label: 'Transactions', icon: Database },
]

export function Aside() {
    const pathname = usePathname()
    const router = useRouter()
    const { disconnect } = useWallet()
    const { setCurrentUser, setAccessToken } = useUser()

    const handleLogout = () => {
        disconnect()
        setCurrentUser(null)
        setAccessToken(null)
        router.push('/')
    }

    return (
        <>
            {/* Desktop sidebar — unchanged */}
            <aside className="hidden md:flex w-[288px] sticky top-0 h-screen self-start shrink-0 overflow-y-auto bg-[#343434] flex-col p-8">
                <div className="pl-3 pt-4">
                    <Image src='/iKash.svg' width={80} height={30} alt='iKash logo' />
                </div>

                <nav className="flex flex-col gap-7.5 pt-20">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        const IconComponent = link.icon
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ease-in-out
                                ${isActive ? 'text-[#BCED09] font-semibold' : 'text-[#8F8389] font-medium hover:bg-[#161618] hover:text-white'}`}
                            >
                                <IconComponent size={18} strokeWidth={isActive ? 2.5 : 2} />
                                <span className='text-[18px]'>{link.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto flex flex-col gap-4 pb-5">
                    <div className="border-t border-gray-700 mb-2" />
                    <Link
                        href="/settings"
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ease-in-out ${
                            pathname.startsWith('/settings') ? 'text-[#BCED09] font-semibold' : 'text-[#8F8389] font-medium hover:bg-[#161618] hover:text-white'
                        }`}
                    >
                        <Settings size={18} strokeWidth={pathname.startsWith('/settings') ? 2.5 : 2} />
                        <span className='text-[18px]'>Settings</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-[#8F8389] cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#161618] hover:text-white"
                    >
                        <Image src='/logout-icon.svg' width={20} height={20} alt='logout' />
                        <span className='text-[18px]'>Logout</span>
                    </button>
                </div>
            </aside>

            <MobileBottomNav links={navLinks} />
        </>
    )
}