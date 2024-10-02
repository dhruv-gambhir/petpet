"use client";

import { login } from "../../Authentication/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogIn = async (event) => {
    event.preventDefault();

    try {
      const user = await login(email, password);
      router.push("/profile");
    } catch (error) {
      alert("Login error:", error.message);
    }
  };

  return (
    <div className="flex flex-row m-8 justify-center items-center bg-white w-1/2 h-4/6">
      <form className="m-8 flex flex-col justify-center items-center w-2/6 h-4/6 ">
        <h1 className="color-mypurple text-2xl font-bold">Login</h1>
        <div className="flex flex-col relative justify-center w-5/6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-mypurple rounded bg-mybg h-8 m-4"
          />
        </div>{" "}
        <div className="flex flex-col relative justify-center w-5/6 ">
          <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-mypurple rounded bg-mybg h-8 m-4"
          />
        </div>{" "}
        <div className="flex flex-col justify-center items-center">
          <button
            type="submit"
            className="bg-mypurple w-16 m-4 rounded p-2 text-white"
            onClick={handleLogIn}
          >
            Login
          </button>

          <a href="/signup" className="text-lg underline">
            New User? Sign Up
          </a>

          <a href="/" className="text-lg underline">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}
