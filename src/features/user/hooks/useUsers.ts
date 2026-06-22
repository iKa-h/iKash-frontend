'use client';

import { useEffect, useState } from "react";
import { Users } from "../models/users";
import { CreateUser } from "../models/createUser";
import { SetupAccountPayload } from "../models/setupAccount";
import { useUser } from "../presentation/context/UserContext";

export function useUsers() {
    const [users, setUsers] = useState<Users[]>([]);
    const [user, setUser] = useState<Users | null>(null);
    const [userFound, setUserFound] = useState<Record<string, Users>>({})
    const { accessToken, currentUser, setAccessToken, setCurrentUser } = useUser();
    const mockProfileUploadEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCK_PROFILE_UPLOAD === "true";

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
            .then((res) => {
                if (!res.ok) throw new Error('Not found users');
                return res.json();
            })
            .then((data) => {
                setUsers(data);
            })
            .catch(err => console.error(err));
    }, []);

    const getUser = async (userId: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`)
            if (!res.ok) throw new Error('User not found');
            const data = await res.json();
            setUserFound(prev => ({ ...prev, [userId]: data }));
        } catch (error) {
            console.error(error)
        }
    }

    const createUser = async (user: CreateUser) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            if (!res.ok) throw new Error('Create user error');
            const data = await res.json();
            setUser(data);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    const updateUser = async (userId: string, userData: Partial<Users>): Promise<Users | null> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
            if (!res.ok) throw new Error('Update user error');
            const data = await res.json();
            setUser(data);
            setCurrentUser(data);
            return data;
        } catch (error) {
            console.error('Error updating user:', error);
            return null;
        }
    }

    const uploadProfilePicture = async (userId: string, file: File): Promise<Users | null> => {
        try {
            const formData = new FormData();
            formData.append("profileImage", file);
            if (mockProfileUploadEnabled && currentUser) {
                formData.append("userSnapshot", JSON.stringify(currentUser));
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/profile-picture`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Upload profile picture error");
            }

            const data = await res.json();
            setUser(data);
            setCurrentUser(data);
            return data;
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            return null;
        }
    }

    const getOrCreateByWallet = async (publicKey: string): Promise<Users | null> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/account?publicKey=${publicKey}`)
            if (!res.ok) throw new Error('Get/Create account error');
            const data = await res.json();
            setUser(data);
            return data;
        } catch (error) {
            console.error('Error in getOrCreateByWallet:', error);
            return null;
        }
    }

    const checkAliasAvailable = async (alias: string): Promise<{ available: boolean }> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/validate-alias?alias=${alias}`)
            if (!res.ok) throw new Error('Check alias error');
            return await res.json();
        } catch (error) {
            console.error('Error in checkAliasAvailable:', error);
            return { available: false };
        }
    }

    const setupAccount = async (userId: string, payload: SetupAccountPayload): Promise<Users | null> => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/setup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload),
            })
            if (!res.ok) throw new Error('Setup account error');
            const data = await res.json(); // Data is { user, access_token }
            
            // Update context with final user and token
            setCurrentUser(data.user);
            setAccessToken(data.access_token);
            
            return data.user;
        } catch (error) {
            console.error('Error in setupAccount:', error);
            return null;
        }
    }

    return { users, user, getUser, createUser, updateUser, uploadProfilePicture, userFound, getOrCreateByWallet, checkAliasAvailable, setupAccount };
}
