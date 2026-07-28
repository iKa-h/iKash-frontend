import { Compass } from "lucide-react";

export default function PlatformOverviewPage() {
  return (
    <div className="space-y-12 animate-[fadeInUp_0.3s_ease-out_forwards]">
      {/* Title Header */}
      <div className="flex flex-col gap-4 border-b border-[#ffffff08] pb-8">
        <div className="flex items-center gap-2 text-[#BCED09]">
          <Compass className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-[1.5px]">Platform Docs</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          Platform Overview
        </h1>
        <p className="text-gray-400 text-sm font-light leading-relaxed max-w-3xl">
          A technical description of the iKash P2P software architecture, defining system boundaries, component responsibilities, and integration patterns.
        </p>
      </div>

      {/* Main Flow Content */}
      <div className="space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">System Purpose</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-light">
            <p>
              iKash is a peer-to-peer (P2P) crypto on/off-ramp platform built on the Stellar blockchain network. It enables users to exchange cryptocurrency assets for fiat currency directly with one another, eliminating the need for a centralized custodian. 
            </p>
            <p>
              The system is designed around a strictly non-custodial architecture. iKash never holds, controls, or has access to user private keys or funds at any point during a transaction. The security of funds in transit is guaranteed by smart contract-based escrows deployed directly on the Stellar network, managed through Trustless Work, an audited, production-grade escrow infrastructure recognized within the Stellar ecosystem.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Architectural Topology</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-light">
            <p>
              The platform operates on a two-component logical architecture: a client-side frontend application and a server-side backend orchestration layer. 
            </p>
            <p>
              The client application serves as the exclusive signing authority. It is the user-facing interface where wallet connections reside and where all transaction signing occurs. When the client receives a prepared External Data Representation (XDR) from the backend, it delegates the signature to the user&apos;s locally installed wallet (via the Stellar Wallet Kit), and returns the signed payload.
            </p>
            <p>
              The backend orchestration layer acts purely as a state manager and coordinator. Its access is limited to reading on-chain state, preparing unsigned transactions, and maintaining relational data. It relies on the Stellar SDK to construct XDR envelopes but lacks the capability to authorize them. Once a transaction is signed client-side, the backend relays the payload to the network or delegates execution to Trustless Work.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Persistence and State Management</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-light">
            <p>
              State persistence is divided into two distinct layers based on data structure. Structured, relational data—such as user profiles, order matching records, escrow metadata (including contract IDs and transaction hashes), and chat message logs—is managed by a PostgreSQL database. The backend interfaces with this database exclusively through the Prisma Object-Relational Mapper (ORM), ensuring type-safe query generation and rigid schema enforcement.
            </p>
            <p>
              Unstructured data, specifically the payment evidence (e.g., bank transfer receipts or screenshots) required during the fiat settlement phase of an escrow, is handled by a dedicated object storage service on Google Cloud Storage (GCS). The backend generates secure upload references and associates the resulting artifact URLs with the corresponding escrow record in the PostgreSQL database, ensuring evidence remains tightly coupled to its transactional context while keeping the relational store optimized.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
