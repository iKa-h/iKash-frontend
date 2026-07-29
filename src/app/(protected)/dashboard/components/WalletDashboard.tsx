'use client';
import { useWallet } from '@/features/wallet';
import { useWalletBalance } from '@/features/wallet/presentation/hooks/useWalletBalance';
import { useState } from 'react';
import { SendFundsModal } from './SendFundsModal';
import { ReceiveFundsModal } from './ReceiveFundsModal';
import { useSearchParams } from 'next/navigation';
import { WalletBalanceCard } from './WalletBalanceCard';
import { WalletAssetList } from './WalletAssetList';
import { MarketSnapshot } from './MarketSnapshot';

export function WalletDashboard() {
  const { publicKey } = useWallet();
  const { balance, balances, isLoading, error } = useWalletBalance(publicKey);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const sendParam = searchParams.get('send');
  const walletParam = searchParams.get('wallet');
  const [isSendModalOpen, setIsSendModalOpen] = useState(sendParam === 'true' || !!walletParam);

  return (
    <div className="w-full flex flex-col pt-6 px-4 pb-24 md:pt-12 md:pr-8 md:pb-12 md:pl-0 md:border-r md:border-[#1F2937] md:max-w-284">
      <WalletBalanceCard balance={balance} isLoading={isLoading} error={error} />
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-white font-bold text-base tracking-wide">Assets</span>
      </div>
      <WalletAssetList balances={balances} isLoading={isLoading} error={error} />
      <div className="mt-6"><MarketSnapshot /></div>
      {isSendModalOpen && <SendFundsModal onClose={() => setIsSendModalOpen(false)} />}
      {isReceiveModalOpen && <ReceiveFundsModal onClose={() => setIsReceiveModalOpen(false)} />}
    </div>
  );
}
