import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#010308] text-gray-300 font-sans selection:bg-[#BCED09] selection:text-[#010308]">
      {/* Top Banner Background Blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#BCED09]/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full bg-[#010308]/80 border-b border-[#ffffff10] backdrop-blur-md sticky top-0 z-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group cursor-pointer font-medium tracking-wide"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-[#BCED09]">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[1.5px]">Legal</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-20 relative z-10">
        <div className="space-y-12">
          <div className="space-y-4 border-b border-[#ffffff10] pb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm tracking-wider uppercase font-bold">
              Last Updated: July 2026
            </p>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">1. Introduction</h2>
            <p className="text-sm leading-relaxed text-gray-400 font-light">
              At iKash, privacy and security are foundational to our architecture. This Privacy Policy details the strict data minimization practices we employ to protect your information. As a non-custodial peer-to-peer (P2P) platform operating on the Stellar network, our system is designed to facilitate trustless transactions without requiring us to hold unnecessary sensitive personal data.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">2. Information We Explicitly Do Not Collect</h2>
            <p className="text-sm leading-relaxed text-gray-400 font-light">
              Due to our zero-trust and decentralized architecture, there are critical pieces of information we categorically refuse to process or store:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-sm text-gray-400 font-light">
              <li><strong className="text-gray-300">Private Keys:</strong> We never request, generate, receive, or store your blockchain private keys. All cryptographic signing occurs locally on your device.</li>
              <li><strong className="text-gray-300">Raw Biometric Data:</strong> We do not store biometric scans, facial recognition data, or raw passport/ID document images. Identity verification is entirely delegated to our specialized partner, Didit.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">3. Information We Collect and Store</h2>
            <p className="text-sm leading-relaxed text-gray-400 font-light">
              To operate the P2P marketplace and ensure a secure trading environment, our backend relational database (PostgreSQL) collects and stores the following strictly necessary data:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-sm text-gray-400 font-light">
              <li><strong className="text-gray-300">Blockchain Identifiers:</strong> Your Stellar public key (wallet address), which acts as your primary identifier.</li>
              <li><strong className="text-gray-300">KYC Status:</strong> An anonymized Didit session identifier and your binary verification status (e.g., &quot;Approved&quot; or &quot;Declined&quot;).</li>
              <li><strong className="text-gray-300">Payment Methods:</strong> Fiat payment details you register (e.g., bank account numbers, beneficiary names, national ID numbers) required for counterparties to send you funds.</li>
              <li><strong className="text-gray-300">Transactional Data:</strong> Offers created, order matching history, and escrow state metadata (e.g., contract IDs, transaction hashes).</li>
              <li><strong className="text-gray-300">Communication & Evidence:</strong> Encrypted chat message logs tied to active orders, and URLs linking to payment evidence (receipts/screenshots) securely stored in Google Cloud Storage.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">4. How We Share Your Information</h2>
            <p className="text-sm leading-relaxed text-gray-400 font-light">
              We do not sell or indiscriminately share your data. Sharing is strictly limited to the functional requirements of the P2P protocol:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-sm text-gray-400 font-light">
              <li><strong className="text-gray-300">Counterparty Exposure:</strong> When you enter into an active order, your registered fiat payment method details are exclusively revealed to your specific counterparty. This is unavoidable and necessary for the fiat settlement phase to occur. This data is not public or accessible outside the context of an active trade.</li>
              <li><strong className="text-gray-300">Infrastructure Providers:</strong> We utilize Google Cloud Platform (Cloud Run, Cloud Storage) and Supabase (managed PostgreSQL) to host our infrastructure securely.</li>
              <li><strong className="text-gray-300">Escrow Providers:</strong> We share necessary order parameters with Trustless Work to deploy smart contracts on the Stellar network.</li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">5. Data Retention Policy</h2>
            <p className="text-sm leading-relaxed text-gray-400 font-light">
              To prevent the accumulation of historical transactional data, iKash enforces a strict two-year retention window for audit and transactional records. After this period, active relational data and associated evidence files are removed from our active databases and moved to a frozen, inaccessible archive, except where prolonged retention is required by applicable laws. Note that on-chain transactions submitted to the Stellar network are public, immutable, and beyond our control to modify or delete.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">6. Your Rights and Consents</h2>
            <p className="text-sm leading-relaxed text-gray-400 font-light">
              By connecting your wallet and interacting with the iKash platform, you explicitly consent to the localized sharing of your payment method details with your trading counterparties. Because your account is bound to your self-custodied wallet, you retain sovereign control over your blockchain identity.
            </p>
          </section>

        </div>
      </main>

      <footer className="w-full border-t border-[#ffffff05] py-12 text-center mt-20">
        <p className="text-xs text-gray-600 font-bold tracking-widest">
          © 2026 IKASH FINANCIAL. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}
