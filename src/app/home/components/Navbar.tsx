"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Image from 'next/image'
import { ConnectButton } from "@/features/wallet/presentation/components/ConnectButton";

const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Features", href: "/features" },
	{ label: "Security", href: "/security" },
	{ label: "Analytics", href: "/analytics" },
];

const walletOptions = [
	{ label: "Lobstr", icon: "🦊", description: "Browser extension", connection: "lobstr" },
	{ label: "Freighter", icon: "🔵", description: "Browser extension", connection: "freighter" }
];

export function Navbar() {
	const [active, setActive] = useState("Home");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

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
		<nav className="w-480 bg-[#010308CC] border-b border-[#FFFFFF1A]">
			<div className="max-w-7xl mx-auto flex items-center justify-between h-16">
				<div className="flex flex-row">
					<Image
						src="/icono-ikash.svg"
						alt="Logo de ikash"
						width={70}
						height={70}
					/>
					<Image
						src="/iKash.svg"
						alt="Logo de ikash"
						width={55}
						height={55}
					/>
				</div>

				<ul className="hidden md:flex items-center gap-8">
					{navLinks.map((link) => (
						<li key={link.label}>
							<Link
								href={link.href}
								onClick={() => setActive(link.label)}
								className={`text-sm transition-colors duration-150 ${active === link.label
									? "text-[#BCED09] font-medium"
									: "text-gray-400 hover:text-white font-medium"
									}`}
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
				<div className="hidden md:block relative" ref={dropdownRef}>
					<button
						onClick={() => setDropdownOpen(!dropdownOpen)}
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
							{walletOptions.map((wallet) => (
								<div key={wallet.label}>
									<ConnectButton label={wallet.label} description={wallet.description} connection={wallet.connection} />
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