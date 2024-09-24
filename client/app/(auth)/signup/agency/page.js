"use client";

import { useState } from "react";
import { signup } from "../../../Authentication/auth.js";
import { useRouter } from "next/navigation";

function AgencySignUp() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [license, setLiscense] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(""); // For displaying errors

    const router = useRouter();

    async function addUser() {
        console.log("User added: ", email, name, phone, address, license);
    }

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const user = await signup(email, password);
            addUser();
            router.push("/login");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-full w-full">
            <div className="w-3/4 h-3/4 bg-white shadow-lg rounded-lg flex flex-row">
                {/* Left side - Form */}
                <form
                    className="w-1/2 p-8 flex flex-col justify-center"
                    onSubmit={handleSignUp}
                >
                    <h1 className="text-mypurple text-3xl font-bold mb-4">
                        Register
                    </h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
                    {/* Display error message */}
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="tel"
                            placeholder="Mobile Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="adress"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="license"
                            placeholder="License Number"
                            value={license}
                            onChange={(e) => setLiscense(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                        />
                    </div>
                </form>

                {/* Right side - Profile Picture Upload */}
                <div className="w-1/2 p-8 flex flex-col justify-center items-center">

                    <div className="border-2 border-dashed border-mypurple w-full h-64 flex justify-center items-center rounded-lg mb-4">
                        <label className="text-mypurple text-center">
                            <p>
                                Drag & Drop your image here or{" "}
                                <span className="text-blue-600 underline cursor-pointer">
                                    choose a file
                                </span>
                            </p>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="bg-mypurple text-white w-full py-3 rounded-lg text-xl"
                        onClick={handleSignUp}
                    >
                        Next
                    </button>
                </div>
            </div>
            <div className="mt-4">
                <a
                    href="/login"
                    className="text-lg text-center underline text-gray-600"
                >
                    Already have an account? Login
                </a>
            </div>
        </div>
    );
}

export default AgencySignUp;

