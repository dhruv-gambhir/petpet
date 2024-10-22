"use client";

import { useEffect, useState } from "react";
import useStore from "@/app/store"; 
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { zId, zLogout } = useStore(); 
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!zId) {
            router.push("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${zId}`);
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    console.error("Failed to fetch user data");
                    router.push("/login");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, [zId]);

    if (!user)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl text-gray-600 animate-pulse">Loading profile...</p>
            </div>
        );

    return (
        <main className="flex items-center justify-center h-full w-full p-8">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-10 transform transition-all duration-300 hover:shadow-2xl">
                <div className="flex flex-col items-center">
                    <img
                        src={user.imageurl || "/default-avatar.jpg"}
                        alt="User Profile"
                        className="w-36 h-36 rounded-full shadow-md mb-6 object-cover"
                    />
                    <h1 className="text-3xl font-extrabold text-gray-800 mb-2">{user.name}</h1>
                    <p className="text-sm text-gray-500 italic mb-4">{user.bio || "No bio available."}</p>
                </div>

                <div className="w-full divide-y divide-gray-200">
                    <ProfileDetails user={user} />
                </div>

                <button
                    onClick={() => {
                        zLogout();
                        router.push("/login");
                    }}
                    className="mt-8 w-full bg-mynav hover:bg-red-600 text-white py-3 px-4 rounded transition duration-300 ease-in-out"
                >
                    Logout
                </button>
            </div>
        </main>
    );
}

function ProfileDetails({ user }) {
    const details = [
        { label: "Email", value: user.email },
        { label: "Mobile", value: user.phonenumber },
        { label: "Address", value: user.address },
        { label: "License Number", value: user.licensenumber },
        {
            label: "Account Created",
            value: new Date(user.createdat).toLocaleDateString(),
        },
        {
            label: "Last Updated",
            value: new Date(user.updatedat).toLocaleDateString(),
        },
    ];

    return (
        <>
            {details.map(
                (detail, index) =>
                    detail.value && (
                        <div key={index} className="flex justify-between py-3">
                            <span className="text-sm font-medium text-gray-600">{detail.label}:</span>
                            <span className="text-sm text-gray-800">{detail.value}</span>
                        </div>
                    )
            )}
            {user.isagency && (
                <p className="text-sm text-blue-600 py-2 text-center">Agency User: Yes</p>
            )}
        </>
    );
}

