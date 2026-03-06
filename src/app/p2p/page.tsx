import { Aside } from "../components/Aside";
import { Header } from "../components/Header";
import { TradeDashboard } from "./components/TradeDashboard";

export default function p2pPage() {
    return (
        <div className="flex min-h-screen w-full">
            <Aside />
            <div className="flex flex-col flex-1 min-w-0">
                <Header description="trading floor" title= "p2p marketplace" />
                <main className="flex items-center justify-between pl-12">
                    <TradeDashboard />
                </main>
            </div>
        </div>
    );
}