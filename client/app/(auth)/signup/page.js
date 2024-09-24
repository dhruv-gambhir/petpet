"use client";

import { useRouter } from "next/navigation";

export default function SignUp() {
    const router = useRouter();

    return(
        <main className="flex flex-col w-full h-full items-center justify-center">
            <p className="text-mypurple text-3xl mt-8">Register As</p>
            <div className="flex flex-row w-full h-full items-center justify-center">
            <button onClick={() => router.push("/signup/user")} className="w-2/6 h-2/4 bg-mypurple text-white text-3xl rounded m-8">
                User
            </button>
            <button onClick={() => router.push("/signup/agency")} className="w-2/6 h-2/4 bg-mypurple text-white text-3xl rounded m-8">
                Agency
            </button>
            </div>
        </main>
    );
};
