"use client";

import { useState, useRef, useEffect } from "react";
import { signup } from "../../../Authentication/auth.js";
import { useRouter } from "next/navigation";
import { uploadFile } from "../../../lib/uploadFile.js";

function UserSignUp() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    const router = useRouter();
    const fileInputRef = useRef(null);

    async function addUser(imageUrl) {
        const data = {
            name: name,
            email: email,
            phonenumber: phone,
            imageurl: imageUrl,
            isagency: false,
        };

        try {
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('User created successfully:', result);
            } else {
                const errorData = await response.json();
                console.error('Error creating user:', errorData);
                setError(errorData.description || 'Error creating user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setError(error.message);
        }
    }

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            let imageUrl = "";
            if (selectedFile) {
                setUploading(true);
                imageUrl = await uploadFile(selectedFile); 
                setUploading(false);
            }

            const user = await signup(email, password);
            await addUser(imageUrl);
            router.push("/login");
        } catch (error) {
            setError(error.message);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="flex flex-col justify-center items-center h-full w-full">
            <div className="w-3/4 h-3/4 bg-white shadow-lg rounded-lg flex flex-row">
                <form
                    className="w-1/2 p-8 flex flex-col justify-center"
                    onSubmit={handleSignUp}
                >
                    <h1 className="text-mypurple text-3xl font-bold mb-4">
                        Register
                    </h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                            required
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
                            type="password"
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border-2 border-mypurple rounded bg-mybg h-12 px-4 w-full"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-mypurple text-white w-full py-3 rounded-lg text-xl"
                        disabled={uploading}
                    >
                        {uploading ? 'Uploading...' : 'Next'}
                    </button>
                </form>

                <div className="w-1/2 p-8 flex flex-col justify-center items-center">
                    <div
                        className="border-2 border-dashed border-mypurple w-full h-64 flex justify-center items-center rounded-lg mb-4 cursor-pointer"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => fileInputRef.current.click()}
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="object-cover h-full w-full rounded-lg"
                            />
                        ) : (
                            <label className="text-mypurple text-center">
                                <p>
                                    Drag & Drop your image here or{" "}
                                    <span className="text-blue-600 underline cursor-pointer">
                                        choose a file
                                    </span>
                                </p>
                            </label>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            ref={fileInputRef}
                        />
                    </div>
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

export default UserSignUp;

