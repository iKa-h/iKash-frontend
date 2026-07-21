import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WrongNetworkBannerProps {
  currentNetwork: string;
  expectedNetwork: string;
}

export const WrongNetworkBanner: React.FC<WrongNetworkBannerProps> = ({ currentNetwork, expectedNetwork }) => {
  return (
    <aside 
      aria-label="Wrong Network Warning"
      className="bg-amber-600 text-white px-4 py-3 shadow-md flex items-center justify-between sticky top-0 z-50"
    >
      <div className="flex items-center gap-3 max-w-4xl mx-auto w-full">
        <AlertTriangle className="w-6 h-6 shrink-0" />
        <div className="text-sm">
          <strong className="font-semibold">Wrong Stellar network detected. </strong>
          <span>
            Application is running on <span className="uppercase font-bold">{expectedNetwork}</span>, but your wallet is connected to <span className="uppercase font-bold">{currentNetwork}</span>. Blockchain actions are temporarily disabled until you switch networks.
          </span>
        </div>
      </div>
    </aside>
  );
};
