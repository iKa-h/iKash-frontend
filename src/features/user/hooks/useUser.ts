import { useEffect, useState } from "react"
import { Users } from "../models/users";

export function useGetUser(publicKey: string | null, userId: string) {
    const [user, setUser] = useState<Users | null>(null);

    useEffect(() => {
        if (!publicKey) return;

        fetch("http://localhost:3000/users/" + userId)
            .then((res) => {
                if (!res.ok) throw new Error('User not found')
                    return res.json()
            })
            .then((data) => {
                setUser(data)
                console.log(data)
            })
    }, [publicKey, userId]);

    return { user };
}