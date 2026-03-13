"use client";

import { useWallet } from "@/features/wallet";
import { useCreateUser } from "../hooks/useCreateUser";

export default function Test() {
    const { publicKey } = useWallet();
    const {createUser, userResponse } = useCreateUser(publicKey);

    return (
        <div>
            <h1>Users</h1>
            <button onClick={() => {createUser({ publicKey: "GDTEST12365478", alias: "BraVarDev" })}}>Create User</button>
        </div>
    );
}