import { useState } from "react";
import { Offer } from "../models/offer";

export function useOfferDelete(publicKey: string | null) {
    const [offerResponse, setOfferResponse] = useState<Offer | null>(null);

    const deleteOffer = async (offerId: string) => {
        if (!publicKey) return;

        try {
            const res = await fetch(`http://localhost:3000/offers/${offerId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            setOfferResponse(data);
        } catch (error) {
            console.error("Error deleting offer:", error);
        }
    }

    return { offerResponse, deleteOffer }
}