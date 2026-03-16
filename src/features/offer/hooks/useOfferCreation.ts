import { useState } from "react";
import { Offer } from "../models/offer";
import { CreateOffer } from "../models/createOffer";

export function useOfferCreation(publicKey: string | null) {
    const [offer, setOffer] = useState<Offer | null>(null);

    const createOffer = async (createOffer: CreateOffer) => {
        if (!publicKey) return;

        try {
            const res = await fetch("http://localhost:3000/offers", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(createOffer)
            })
            if (!res.ok) throw new Error('Create offer error');
            const data = await res.json();
            setOffer(data);
        } catch (error) {
            console.error('Error', error);
        }
    }

    return { offer, createOffer }
}