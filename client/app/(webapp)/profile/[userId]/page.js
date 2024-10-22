"use client";

import { useEffect, useState } from "react";
import useStore from "@/app/store"; // Import Zustand store
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { zId, zLogout } = useStore(); // Access zId and logout function from store
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!zId) {
            router.push("/login"); // Redirect if not logged in
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}//users/${zId}`); // Call the user API
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    console.error("Failed to fetch user data");
                    router.push("/login"); // Handle case if user not found
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, [zId]);

    if (!user) return <p>Loading...</p>;

    return (
        <main className="flex flex-col items-center justify-center p-8">
            <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
            <div className="flex flex-col items-center">
                <img
                    src={user.imageurl || "/default-avatar.png"}
                    alt="User Profile"
                    className="w-32 h-32 rounded-full mb-4"
                />
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-gray-500">Mobile: {user.phonenumber}</p>
                <button
                    onClick={() => {
                        zLogout();
                        router.push("/login");
                    }}
                    className="mt-6 bg-red-500 text-white py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>
        </main>
    );
}

