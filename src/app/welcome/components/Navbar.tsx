"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Image from 'next/image'
import { ConnectButton } from "@/features/wallet/presentation/components/ConnectButton";
import { walletOptions } from "@/features/wallet/config/wallet-options";
import { usePathname } from "next/navigation";

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Statistics", href: "/stats" },
	{ label: "Info", href: "/info" },
];

export function Navbar({ onConnectClick }: { onConnectClick?: () => void }) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname()

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<nav className="w-full bg-[#010308CC] border-b border-[#FFFFFF1A] backdrop-blur-md sticky top-0 z-50 px-4 md:px-8">
			<div className="max-w-7xl mx-auto flex items-center justify-between h-16">
				<div className="flex flex-row">
					<Image
						src="/ikashlogotipo.svg"
						alt="Logo de ikash"
						width={100}
						height={45}
					/>
				</div>

				<ul className="hidden md:flex items-center gap-8">
					{navLinks.map((link) => {
						const isActive = pathname === link.href
						return (
							<li key={link.label}>
								<Link
									href={link.href}
									className={`text-sm transition-colors duration-150 ${isActive
										? "text-[#BCED09] font-medium"
										: "text-gray-400 hover:text-white font-medium"
										}`}
								>
									{link.label}
								</Link>
							</li>
						);
					})}
				</ul>
				<div className="hidden md:block relative" ref={dropdownRef}>
					<button
						onClick={onConnectClick || (() => setDropdownOpen(!dropdownOpen))}
						className="flex items-center gap-1 justify-center bg-[#BCED09] hover:bg-[#9bc505] active:scale-95 text-[#010308] 
                        text-sm font-bold w-[150.02px] h-10 rounded-full transition-all duration-150 cursor-pointer"
					>
						Connect Wallet
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none"
							className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>
							<path d="M3 5L7 9L11 5" stroke="#0d0d0d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>

					{dropdownOpen && (
						<div className="absolute right-0 mt-2 w-64 border border-[#BCED09] rounded-xl shadow-2xl overflow-hidden z-50">
							<p className="text-xs text-gray-500 px-4 pt-3 pb-2 uppercase tracking-widest">
								Choose wallet
							</p>
							{walletOptions.filter((wallet) => wallet.enabled).map((wallet) => (
								<div key={wallet.id}>
									<ConnectButton label={wallet.name} description={wallet.description} walletId={wallet.id} icon={wallet.icon} />
								</div>
							))}
							<div className="border-t border-white/10 px-4 py-3">
								<p className="text-xs text-gray-600 text-center">
									By connecting you agree to our{" "}
									<span className="text-[#c8f135] cursor-pointer hover:underline">Terms</span>
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}