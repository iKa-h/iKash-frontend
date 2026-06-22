'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Users } from '../../models/users';
import { walletService } from '../../../wallet/application/wallet.service';

const mockProfileUploadEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK_PROFILE_UPLOAD === "true";

const MOCK_USER: Users = {
    userId: "mock-user-1",
    publicKey: "GMOCKPUBLICKEY1234567890",
    alias: "Chijioke",
    email: "chijioke@example.com",
    notificationsEnabled: true,
    pendingAccountInfo: false,
    kycStatus: "approved",
    totalVolume: "0",
    createdAt: new Date("2026-06-18T00:00:00.000Z").toISOString(),
    bio: "",
    profileImageUrl: "",
};

function isTokenExpired(token: string | null) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        return true;
    }
}

interface UserContextType {
    currentUser: Users | null;
    setCurrentUser: (user: Users | null) => void;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<Users | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const logout = useCallback(() => {
        setCurrentUser(null);
        setAccessToken(null);
        localStorage.removeItem('ikash_user');
        localStorage.removeItem('ikash_token');
        localStorage.removeItem('ikash_wallet_session');
        walletService.clearSession();
        window.location.href = "/";
    }, []);

    // Optional: Load user from localStorage or similar if needed
    useEffect(() => {
        const storedToken = localStorage.getItem('ikash_token');
        if (storedToken) {
            if (isTokenExpired(storedToken)) {
                logout();
                return;
            }
            setAccessToken(storedToken);
        }

        const storedUser = localStorage.getItem('ikash_user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
                return;
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
        }

        if (mockProfileUploadEnabled) {
            setCurrentUser(MOCK_USER);
            localStorage.setItem('ikash_user', JSON.stringify(MOCK_USER));
        }
    }, [logout]);

    // Periodically check for token expiration
    useEffect(() => {
        if (!accessToken) return;

        const interval = setInterval(() => {
            if (isTokenExpired(accessToken)) {
                logout();
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [accessToken, logout]);

    const handleSetCurrentUser = (user: Users | null) => {
        setCurrentUser(user);
        if (user) {
            localStorage.setItem('ikash_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('ikash_user');
        }
    };

    const handleSetAccessToken = (token: string | null) => {
        setAccessToken(token);
        if (token) {
            localStorage.setItem('ikash_token', token);
        } else {
            localStorage.removeItem('ikash_token');
        }
    };

    // logout defined above via useCallback

    return (
        <UserContext.Provider value={{ 
            currentUser, 
            setCurrentUser: handleSetCurrentUser, 
            accessToken,
            setAccessToken: handleSetAccessToken,
            isLoading, 
            setIsLoading,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
