import { Aside } from "../components/Aside";
import { Header } from "../components/Header";
import { WalletDashboard } from "./components/WalletDashboard";

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen w-full">
            <Aside />
            <div className="flex flex-col flex-1 min-w-0">
                <Header description="account overview" title= "Welcome back," name="Alexander" />
                <main className="flex items-center justify-between pl-12">
                    <WalletDashboard />
                </main>
            </div>
        </div>
    );
}