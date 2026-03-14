import { useState } from "react";
import { Users } from "../models/users";
import { CreateUser } from "../models/createUser";

export function useUserUpdate(publicKey: string | null) {
    const [updateResponse, setUpdateResponse] = useState<Users | null>(null);

    const updateUser = async (userId: string, userData: CreateUser) => {
        if (!publicKey) return;

        try {
            const res = await fetch("http://localhost:3000/users/" + userId, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })

            if (!res.ok) throw new Error('Update user error');

            const data = await res.json();
            setUpdateResponse(data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    return { updateResponse, updateUser };
}