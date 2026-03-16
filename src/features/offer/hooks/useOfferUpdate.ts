import { useState } from "react"
import { Offer } from "../models/offer"
import { UpdateOffer } from "../models/updateOffer";

export function useOfferUpdate(publicKey: string | null) {
    const [offerResponse, setOfferResponse] = useState<Offer | null>(null);

    const updateOffer = async (offerId: string, updateOffer: UpdateOffer) => {
        if (!publicKey) return;
        try {
            const res = await fetch(`http://localhost:3000/offers/${offerId}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(updateOffer)
            });
            if (!res.ok) throw new Error('Update offer error');
            const data = await res.json();
            setOfferResponse(data);
        } catch (error) {
            console.error('Error updating offer:', error);
        }
    }

    return { offerResponse, updateOffer}
}