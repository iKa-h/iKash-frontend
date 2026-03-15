"use client";

import { useOfferUpdate } from "@/features/offer/hooks/useOfferUpdate";
import { useWallet } from "@/features/wallet";

export default function Test() {
    const { publicKey } = useWallet();
    const { updateOffer } = useOfferUpdate(publicKey);

    const handleUpdateOffer = () => {
        updateOffer("b222725b-a5de-403b-ae10-98a1fc99e6ce", {
            status: "active"
        });
    }

    return (
        <div>
            <h1>Tests</h1>
            <button className="cursor-pointer bg-amber-900" onClick={handleUpdateOffer}>
                Update Offer
            </button>
        </div>
    );
}