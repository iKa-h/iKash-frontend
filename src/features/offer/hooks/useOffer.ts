import { useEffect, useState } from "react";
import { Offer } from "../models/offer";

export function useOffer(publicKey: string | null, offerId: string) {
    const [offer, setOffer] = useState<Offer | null>(null);

    useEffect(() => {
        if (!publicKey) return;

        fetch(`http://localhost:3000/offers/${offerId}`)
            .then(res => {
                if (!res.ok) throw new Error('Offer not found');
                return res.json();
            })
            .then(data => {
                setOffer(data);
            });
    }, [publicKey, offerId]);

    return { offer };
}