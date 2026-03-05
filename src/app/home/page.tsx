import { Aside } from "./components/Aside";
import { Header } from "./components/Header";

export function HomePage() {
    return (
        <div className="flex min-h-screen w-full">
            <Aside />
            <div className="flex flex-col flex-1 min-w-0">
                <Header name= "Jeffrey" balance= {12000.00} />
                <main className="">
                    <h1>Main content</h1>
                </main>
            </div>
        </div>
    );
}