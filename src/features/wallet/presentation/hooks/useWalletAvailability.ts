"use client";

import { useEffect, useState } from "react";
import { stellarWalletKitService } from "../../application/stellar-wallet-kit.service";

// Drives the AVAILABLE / NOT_INSTALLED distinction for each wallet card:
// asks the kit which of the configured modules can actually be used in this
// browser right now (e.g. is the extension installed).
export function useWalletAvailability() {
    const [availability, setAvailability] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        stellarWalletKitService.refreshSupportedWallets().then((wallets) => {
            if (cancelled) return;
            const map: Record<string, boolean> = {};
            for (const wallet of wallets) {
                map[wallet.id] = wallet.isAvailable;
            }
            setAvailability(map);
            setIsLoading(false);
        });

        return () => { cancelled = true; };
    }, []);

    return { availability, isLoading };
}
