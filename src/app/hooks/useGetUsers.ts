'use client';

import { useEffect, useState } from "react";
import { Users } from "../utils/users";

export function useGetUsers(publicKey: string | null) {
    const [users, setUsers] = useState<Users[]>([]);

    useEffect(() => {
        if (!publicKey) return;

        fetch("http://localhost:3000/users")
            .then((res) => { 
                if (!res.ok) throw new Error('Not found users');
                return res.json();
             })
            .then((data) => { 
                setUsers(data)
                console.log(data)
            });
    }, [publicKey]);
    return { users };
}