"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const router = useRouter();

    return(
        <main className="flex flex-row w-full h-full">
            <button onClick={() => router.push("/signup/user")} className="w-2/6 h-2/4">
                User
            </button>
        </main>
    );
};
