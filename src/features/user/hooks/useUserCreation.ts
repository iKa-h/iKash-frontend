import { useState } from "react";
import { CreateUser } from "../models/createUser";
import { Users } from "../models/users";

export function useUserCreation(publicKey: string | null) {
    const [userResponse, setUserResponse] = useState<Users | null>(null);

    const createUser = async (user: CreateUser) => {
        if (!publicKey) return;

        try {
            const res = await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            if (!res.ok) throw new Error('Create user error');
            const data = await res.json();
            setUserResponse(data);
            console.log(data);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }
    return { createUser, userResponse }
}