"use client";

import { useWallet } from "@/features/wallet";
import { useUser } from "@/features/user/presentation/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isConnected, isLoading } = useWallet();
  const { currentUser } = useUser();
  const router = useRouter();
  const mockProfileUploadEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK_PROFILE_UPLOAD === "true";
  const canBypassInDev =
    process.env.NODE_ENV !== "production" &&
    mockProfileUploadEnabled &&
    Boolean(currentUser?.userId);
  const canAccess = isConnected || canBypassInDev;

  useEffect(() => {
    if (!isLoading && !canAccess) {
      router.replace("/welcome");
    }
  }, [canAccess, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#010308]">
        <div className="w-8 h-8 border-4 border-[#BCED09] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!canAccess) return null;

  return <>{children}</>;
}
