"use client";

import { login } from "../../Authentication/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "../../store";

export default function Login() {
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { zLogin } = useStore();

    const fetchUserId = async (email) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/id/email/${email}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch user ID");
        }

        const data = await response.json();
        return data.user_id;
    };

    const handleLogIn = async (event) => {
        event.preventDefault();

        try {
            await login(email, password);
            const userId = await fetchUserId(email);
            setId(userId);
            zLogin(userId, email);
            console.log(userId, email);
            router.push(`/profile/${userId}`);
        } catch (error) {
            alert(`Login error: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-row m-8 justify-center items-center bg-white w-1/2 h-4/6">
            <form className="m-8 flex flex-col justify-center items-center w-2/6 h-4/6 ">
                <h1 className="color-black text-2xl font-bold">Login</h1>
                <div className="flex flex-col relative justify-center w-5/6">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-2 border-black rounded bg-mynavbutton h-8 m-4"
                    />
                </div>{" "}
                <div className="flex flex-col relative justify-center w-5/6 ">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-2 border-black rounded bg-mynavbutton h-8 m-4"
                    />
                </div>{" "}
                <div className="flex flex-col justify-center items-center">
                    <button
                        type="submit"
                        className="bg-mybutton border-black border-1 border w-16 m-4 rounded p-2 text-black"
                        onClick={handleLogIn}
                    >
                        Login
                    </button>

                    <a href="/signup" className="text-lg underline">
                        New User? Sign Up
                    </a>
                </div>
            </form>
        </div>
    );
}
