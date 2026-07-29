import { BookOpen } from "lucide-react";

export default function PlatformFeaturesPage() {
  return (
    <div className="space-y-12 animate-[fadeInUp_0.3s_ease-out_forwards]">
      {/* Title Header */}
      <div className="flex flex-col gap-4 border-b border-[#ffffff08] pb-8">
        <div className="flex items-center gap-2 text-[#BCED09]">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-[1.5px]">Platform Docs</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          Platform Features
        </h1>
        <p className="text-gray-400 text-sm font-light leading-relaxed max-w-3xl">
          Core operational flows and external service integrations that power the P2P exchange mechanics and smart contract escrows.
        </p>
      </div>

      <div className="space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Decentralized Escrow Lifecycle</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-light">
            <p>
              The platform utilizes Trustless Work to manage the lifecycle of decentralized smart contract escrows directly on the Stellar network. When a buyer and seller are matched, the backend requests the deployment of a multi-release milestone escrow contract via the Trustless Work REST API.
            </p>
            <p>
              This integration ensures a strict boundary between coordination and custody. The backend orchestrates the state transitions—creating the escrow entry, tracking its status, and notifying counterparties—while Trustless Work enforces the cryptographic rules of the trade. Because these contracts are immutable and self-executing, funds can only be locked or released upon receiving authorized on-chain signatures from the legitimate counterparties.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">P2P Workflow and Fund Operations</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-light">
            <p>
              The transaction lifecycle begins when a seller accepts an existing offer. The backend constructs an unsigned XDR transaction required to fund the newly deployed escrow. The frontend receives this XDR, requests the seller to authorize it locally via their connected wallet, and submits the signed transaction. This firmly places the seller as the actor who locks the cryptocurrency into the escrow.
            </p>
            <p>
              Following the on-chain funding, the fiat settlement occurs as an off-chain interaction. The buyer transfers the agreed fiat amount to the seller&apos;s registered payment method (e.g., bank transfer or local payment rails) and uploads the confirmation receipt to the platform. 
            </p>
            <p>
              In the final phase, upon verifying receipt of the fiat funds in their personal account, the seller authorizes the release of the escrowed crypto. The backend obtains an unsigned release XDR from Trustless Work, the seller signs it client-side, and the backend broadcasts the signature, triggering the smart contract to transfer the locked assets to the buyer&apos;s wallet.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Wallet Accessibility Layer</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-light">
            <p>
              To accommodate a diverse user base without enforcing a single wallet provider, the frontend application integrates the Stellar Wallet Kit (SWK). SWK acts as a unified interface layer, allowing users to connect using their preferred Stellar-compatible browser extensions (such as Freighter, Albedo, or LOBSTR).
            </p>
            <p>
              This integration abstracts the specific wallet connection logic while preserving the platform&apos;s non-custodial guarantee. Irrespective of the wallet chosen, the private keys remain secured within the user&apos;s local environment, and all cryptographic signatures requested by the iKash backend are executed securely within that isolated context.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
