import { useEffect, useState } from "react"
import { Users } from "../utils/users";

export function useGetUser(publicKey: string | null, userId: string) {
    const [user, setUser] = useState<Users | null>(null);

    useEffect(() => {
        if (!publicKey) return;

        fetch("http://localhost:3000/users/" + userId)
            .then((res) => {
                if (!res) throw new Error('User not found')
                    return res.json()
            })
            .then((data) => {
                setUser(data)
                console.log(data)
            })
    }, [publicKey, userId]);

    return { user };
}