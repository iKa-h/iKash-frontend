import { Aside } from "../../components/Aside";
import { Header } from "../../components/Header";
import { OrderNavbar } from "./components/OrderNavbar";
import { TradeDashboard } from "./components/TradeDashboard";
import { OrdersSummaryBox } from "./components/OrdersSummaryBox";

export default function p2pPage() {
    return (
        <div className="flex min-h-screen w-full bg-[#010308]">
            <Aside />
            <div className="flex flex-col min-w-0 flex-1">
                <Header description="trading floor" title="p2p marketplace" />
                <OrderNavbar />
                <main className="flex-1 pt-0 flex gap-4">
                    <div className="px-8 h-full">
                        <TradeDashboard />
                    </div>
                    
                    <div className="w-px bg-[#1F2937] h-full" />
                    <div className="flex-1 pt-8 px-8 flex flex-col gap-6 shrink-0">
                        <OrdersSummaryBox />
                    </div>
                </main>
            </div>
        </div>
    );
}