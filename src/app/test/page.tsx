"use client";

import { useOfferCreation } from "@/features/offer/hooks/useOfferCreation";
import { useUserCreation } from "@/features/user/hooks/useUserCreation";
import { useWallet } from "@/features/wallet";

export default function Test() {
    const { publicKey } = useWallet();
    const { createOffer } = useOfferCreation(publicKey);

    const handleCreateUser = () => {
        createOffer({
            creatorId: "c49c276d-9af6-4069-9fba-4c5d195483d8",
            type: "buy",
            assetCode: "USDC",
            price: "540.00",
            minAmount: "50",
            maxAmount: "1000"
        });
    }

    return (
        <div>
            <h1>Tests</h1>
            <button className="cursor-pointer bg-amber-900" onClick={handleCreateUser}>
                Create Offer
            </button>
        </div>
    );
}