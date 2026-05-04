'use client'

import { useState } from 'react'
import { Header } from './components/Header'
import { Line } from './components/Line'
import { ProgressBar } from './components/ProgressBar'
import Stage1 from './pages/Stage1'
import Stage2 from './pages/Stage2'
import Stage3 from './pages/Stage3'

export default function SetupAccount() {
    const [stage, setStage] = useState<1 | 2 | 3>(1);

    return (
        <div className="relative flex flex-col justify-start items-center min-h-screen w-full overflow-y-auto overflow-x-hidden [@media(min-height:900px)]:pb-[72px] [@media(min-height:900px)]:pt-[72px]">
            <div className="absolute top-0 [@media(min-height:900px)]:top-[72px] left-0 w-full">
                <Line />
            </div>
            <div className="w-full max-w-content flex flex-col items-center mt-[20px] mb-8 z-10">
                <div className="flex flex-col gap-6 w-full items-center">
                    <ProgressBar stage={stage} />
                    <Header />
                    {stage === 1 && <Stage1 onNext={() => setStage(2)} />}
                    {stage === 2 && <Stage2 onNext={() => setStage(3)} />}
                    {stage === 3 && <Stage3 onFinish={() => {}} />}
                </div>
            </div>
            
            <div className="absolute bottom-0 [@media(min-height:900px)]:bottom-[72px] left-0 w-full">
                <Line />
            </div>
        </div>
    );
}