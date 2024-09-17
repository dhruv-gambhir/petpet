"use client";

import Title from "./Title";
import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter();

    return (
        <nav className="bg-white w-full h-40 flex-none flex flex-row items-center justify-center">
            <div className="flex flex-row justify-between w-full">
                <Title className="w-1/2 left-2" />
                <div className="w-1/2 h-full right-2 flex flex-row">
                    <button
                        className="h-16 w-1/6 bg-gray-300 border-1 border-black rounded mx-8 justify-end"
                        onClick={() => {
                            router.push("/sitters/owner");
                        }}
                    >
                        Sitters
                    </button>
                    <button
                        className="w-1/6 bg-gray-300 border-1 border-black rounded mx-8"
                        onClick={() => {
                            router.push("/events");
                        }}
                    >
                        Events
                    </button>
                    <button
                        className="w-1/6 bg-gray-300 border-1 border-black rounded mx-8"
                        onClick={() => {
                            router.push("/adoption");
                        }}
                    >
                        Adoption
                    </button>
                    <button
                        className="w-1/6 bg-gray-300 border-1 border-black rounded mx-8"
                        onClick={() => {
                            router.push("/profile");
                        }}
                    >
                        Profile
                    </button>
                </div>
            </div>
        </nav>
    );
}
