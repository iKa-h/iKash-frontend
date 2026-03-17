import { useEffect, useState } from "react";
import { Offer } from "../models/offer";
import { CreateOffer } from "../models/createOffer";
import { UpdateOffer } from "../models/updateOffer";

export function useOffers() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [offer, setOffer] = useState<Offer | null>(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers`)
            .then(res => {
                if (!res.ok) throw new Error('Offers not found');
                return res.json();
            })
            .then(data => {
                setOffers(data);
            })
            .catch(err => console.error(err));
    }, []);

    const getOffer = async (offerId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/${offerId}`);
            if (!res.ok) throw new Error('Offer not found');
            const data = await res.json();
            setOffer(data);
        } catch (error) {
            console.error(error)
        }
    }

    const createOffer = async (newOffer: CreateOffer) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(newOffer)
            })
            if (!res.ok) throw new Error('Create offer error');
            const data = await res.json();
            setOffer(data);
        } catch (error) {
            console.error('Error', error);
        }
    }

    const updateOffer = async (offerId: string, updateOffer: UpdateOffer) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/${offerId}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(updateOffer)
            });
            if (!res.ok) throw new Error('Update offer error');
            const data = await res.json();
            setOffer(data);
        } catch (error) {
            console.error('Error updating offer:', error);
        }
    }

    const deleteOffer = async (offerId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/${offerId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            setOffer(data);
        } catch (error) {
            console.error(error);
        }
    }

    return { offers, offer, getOffer, createOffer, updateOffer, deleteOffer };
}