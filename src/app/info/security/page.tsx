import { ShieldCheck } from "lucide-react";

export default function PlatformSecurityPage() {
  return (
    <div className="space-y-12 animate-[fadeInUp_0.3s_ease-out_forwards]">
      {/* Title Header */}
      <div className="flex flex-col gap-4 border-b border-[#ffffff08] pb-8">
        <div className="flex items-center gap-2 text-[#BCED09]">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-[1.5px]">Platform Docs</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
          Ecosystem Security
        </h1>
        <p className="text-gray-400 text-sm font-light leading-relaxed max-w-3xl">
          An overview of trust boundaries, cryptographic invariants, and the compartmentalization of data risk across the architecture.
        </p>
      </div>

      <div className="space-y-10">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Private Key Invariants</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-light">
            <p>
              The fundamental security property of the system dictates that user private keys never leave the user&apos;s device. The architecture delegates all signing authority exclusively to the frontend environment, communicating directly with the user&apos;s locally installed wallet extension. 
            </p>
            <p>
              The backend infrastructure is structurally incapable of initiating a transfer or altering an escrow state unilaterally. Its operational scope is strictly confined to fetching on-chain state, generating unsigned transaction envelopes, forwarding them to the client for authorization, and relaying the resulting cryptographic signatures to the network. Consequently, even a total compromise of backend services cannot result in the unauthorized extraction of user funds.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Decentralized KYC and Data Minimization</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-light">
            <p>
              Identity verification (Know Your Customer) requires the handling of highly sensitive personally identifiable information (PII). Rather than internalizing this risk, the architecture delegates biometric scanning and document verification entirely to Didit, a specialized and compliant decentralized identity provider.
            </p>
            <p>
              During the onboarding process, the backend initializes a secure session and redirects the user to Didit&apos;s hosted infrastructure. Upon completion, Didit transmits a signed webhook containing only the binary resolution of the verification (Approved or Declined). The backend persists only this status flag and an anonymized session identifier. Raw biometric data and passport images are never processed, transmitted, or stored within the internal system boundaries.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Escrow Dispute Resolution</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-light">
            <p>
              While the smart contracts managing the escrows are self-executing and immune to backend manipulation, the P2P protocol must account for scenarios where fiat settlements are contested. To address this, the Trustless Work integration provisions a designated resolver role within the contract initialization parameters.
            </p>
            <p>
              This role allows a segregated platform support key to intervene exclusively in the event of a dispute. The resolution process relies entirely on the objective evaluation of the unstructured payment evidence uploaded by the buyer to the object storage service. By enforcing resolution through the contract&apos;s defined mechanics rather than an administrative backdoor, the cryptographic guarantee that funds cannot be arbitrarily moved remains intact.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Network and API Protections</h2>
          <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-light">
            <p>
              In addition to architectural compartmentalization, the platform employs defense-in-depth strategies at the network layer. Authentication is governed by short-lived JSON Web Tokens (JWT) issued only after a successful cryptographic challenge proving wallet ownership.
            </p>
            <p>
              Furthermore, both frontend and backend services are deployed in isolated Docker containers via Google Cloud Run, separating compute domains. The backend API enforces stringent Cross-Origin Resource Sharing (CORS) policies, supplemented by Google Cloud IAM controls, ensuring that only the official frontend domain possesses the authority to invoke backend operations.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
