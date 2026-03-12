'use client';

import { useState } from 'react';

export function KycVerificationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startKyc = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/kyc/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Hardcoded testing userId. In reality, get from auth context.
        body: JSON.stringify({ userId: 'fa1f421d-64dc-47f3-a5f6-e3b8f5cb65dc' }),
      });

      if (!response.ok) {
        throw new Error('Failed to start KYC session');
      }

      const data = await response.json();
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error('No session URL returned');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 p-5 border rounded-2xl bg-white shadow-sm border-gray-200 min-w-[300px]">
      <h3 className="text-lg font-semibold text-gray-900">Identity Verification</h3>
      <p className="text-sm text-gray-500 mb-2">
        Verify your identity with Didit to unlock crypto transactions.
      </p>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md w-full">
          {error}
        </div>
      )}

      <button
        onClick={startKyc}
        disabled={isLoading}
        className="px-4 py-2 mt-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Starting verification...' : 'Verify with Didit'}
      </button>
    </div>
  );
}
