import { useEffect, useState } from "react";
import { Offer } from "../models/offer";

export function useOfferDelete(publicKey: string | null) {
    const [offerResponse, setOfferResponse] = useState<Offer | null>(null);

    useEffect(() => {
        if (!publicKey) return;
        
    }, [publicKey]);
}