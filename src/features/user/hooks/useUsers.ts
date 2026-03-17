'use client';

import { useEffect, useState } from "react";
import { Users } from "../models/users";
import { CreateUser } from "../models/createUser";

export function useGetUsers() {
    const [users, setUsers] = useState<Users[]>([]);
    const [user, setUser] = useState<Users | null>(null);

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
            setUser(data);
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

    const updateUser = async (userId: string, userData: CreateUser) => {
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
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    return { users, user, getUser, createUser, updateUser };
}