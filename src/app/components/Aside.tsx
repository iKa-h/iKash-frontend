'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const links = [
    { href: '/dashboard', label: 'Home', icon: '/home-icon.svg', selected: '/home-selected-icon.svg' },
    { href: '/p2p', label: 'P2P', icon: '/p2p-icon.svg', selected: '/p2p-selected-icon.svg' },
    { href: '/transactions', label: 'Transactions', icon: '/transaction-icon.svg', selected: '/transaction-selected-icon.svg' },
    { href: '/wallet', label: 'Wallet', icon: '/wallet-icon.svg', selected: '/home-selected-icon.svg' },
]

export function Aside() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex w-[288px] min-h-screen bg-[#343434] flex-col p-8">

            <div className="pl-[12px] pt-4">
                <Image
                    src='/iKash.svg'
                    width={80}
                    height={30}
                    alt='icono de settings del aside'
                />
            </div>

            <nav className="flex flex-col gap-7.5 pt-20">
                {links.map(({ href, label, icon, selected }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-3 rounded-lg transition
                        ${pathname === href
                                ? 'text-[#BCED09] font-semibold'
                                : 'text-[#8F8389] font-medium'
                            }`}
                    >
                        <span>
                            {pathname === href
                                ? <Image
                                    src={selected}
                                    width={18}
                                    height={18}
                                    alt='iconos del aside'
                                />
                                : <Image
                                    src={icon}
                                    width={18}
                                    height={18}
                                    alt='iconos del aside'
                                />
                            }
                        </span>
                        <span className='text-[18px]'>{label}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4 pb-5">
                <div className="border-t border-gray-700 mb-2" />

                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8F8389] font-medium transition"
                >
                    <span>
                        <Image
                            src='/settings-icon.svg'
                            width={20}
                            height={20}
                            alt='icono de settings del aside'
                        />
                    </span>
                    <span className='text-[18px]'>Settings</span>
                </Link>

                <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#8F8389] transition">
                    <span>
                        <Image
                            src='/logout-icon.svg'
                            width={20}
                            height={20}
                            alt='icono de settings del aside'
                        /></span>
                    <span className='text-[18px]'>Logout</span>
                </button>
            </div>

        </aside>
    )
}