import { useEffect, useState } from "react";
import { Offer } from "../models/offers";

export function useOffers(publicKey: string | null) {
    const [offers, setOffers] = useState<Offer[]>([]);

    useEffect(() => {
        if (!publicKey) return;
        fetch("http://localhost:3000/offers")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setOffers(data);
            })
    }, [publicKey])

    return { offers };
}