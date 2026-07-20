import { useEffect, useState, useCallback, useRef } from "react";
import { Offer } from "../models/offer";
import { CreateOffer } from "../models/createOffer";
import { UpdateOffer } from "../models/updateOffer";
import { useUser } from "@/features/user/presentation/context/UserContext";

export function useOffers(filters?: Record<string, string>) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [offer, setOffer] = useState<Offer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { accessToken, logout } = useUser();

    // Tracks the AbortController for the most recent in-flight fetch so that
    // stale responses from earlier requests cannot overwrite newer results.
    const abortRef = useRef<AbortController | null>(null);

    const fetchOffers = useCallback(async (currentFilters?: Record<string, string>) => {
        // Cancel any previous in-flight request
        if (abortRef.current) {
            abortRef.current.abort();
        }
        const controller = new AbortController();
        abortRef.current = controller;

        setIsLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/offers`;
            if (currentFilters) {
                const params = new URLSearchParams(currentFilters);
                const queryString = params.toString();
                if (queryString) {
                    url += `?${queryString}`;
                }
            }
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) throw new Error('Offers not found');
            const data = await res.json();
            setOffers(data);
        } catch (err: unknown) {
            // Ignore intentional aborts (stale request cancelled by newer one)
            if (err instanceof Error && err.name === "AbortError") return;
            console.error(err);
        } finally {
            // Only clear loading if this controller is still the active one
            if (abortRef.current === controller) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchOffers(filters);
    }, [filters, fetchOffers]);

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
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(newOffer)
            })
            if (res.status === 401) {
                logout();
                throw new Error("Su sesión ha expirado por inactividad. Cerrando sesión...");
            }
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error('Backend Create Offer Error:', errData);
                const errMsg = errData.message ? (Array.isArray(errData.message) ? errData.message.join(', ') : errData.message) : 'Create offer error';
                throw new Error(errMsg);
            }
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error', error);
            throw error;
        }
    }

    const updateOffer = async (offerId: string, updateOffer: UpdateOffer) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/${offerId}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(updateOffer)
            });
            if (!res.ok) throw new Error('Update offer error');
            const data = await res.json();
            setOffer(data);
        } catch (error) {
            console.error('Error updating offer:', error);
            throw error;
        }
    }

    const deleteOffer = async (offerId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/offers/${offerId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            const data = await res.json();
            setOffer(data);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    return { offers, offer, fetchOffers, getOffer, createOffer, updateOffer, deleteOffer, isLoading };
}