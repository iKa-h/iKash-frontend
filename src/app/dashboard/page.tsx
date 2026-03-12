import { Aside } from "../components/Aside";
import { Header } from "../components/Header";
import { WalletDashboard } from "./components/WalletDashboard";
import { KycVerificationButton } from "../../features/kyc/components/KycVerificationButton";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen w-full">
            <Aside />
            <div className="flex flex-col flex-1 min-w-0">
                <Header description="account overview" title= "Welcome back," name="Alexander" />
                <main className="flex flex-col gap-6 items-start pl-12 pt-6">
                    <KycVerificationButton />
                    <WalletDashboard />
                </main>
            </div>
        </div>
    );
}