'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Users } from '../../models/users';
import { walletService } from '../../../wallet/application/wallet.service';

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
        const storedUser = localStorage.getItem('ikash_user');

        const timer = setTimeout(() => {
            if (storedToken && !isTokenExpired(storedToken)) {
                setAccessToken(storedToken);
            }

            if (storedUser && storedToken && !isTokenExpired(storedToken)) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    // Force re-login if local user has old wallet address as userId
                    if (parsedUser.userId && parsedUser.userId.startsWith('G') && parsedUser.userId.length === 56) {
                        localStorage.removeItem('ikash_user');
                        localStorage.removeItem('ikash_token');
                        localStorage.removeItem('ikash_wallet_session');
                        walletService.clearSession();
                        window.location.href = "/";
                        return;
                    }
                    setCurrentUser(parsedUser);
                    return;
                } catch (err) {
                    console.error('Error parsing stored user:', err);
                }
            }
        }, 0);

        return () => clearTimeout(timer);
    }, []);

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
