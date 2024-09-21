"use client";

import { useState } from "react";

import { signup } from "../../Authentication/auth.js";
import { useRouter } from "next/navigation";

/*
async function addUser(email, username) {
    const response = await fetch("/api/add-user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            username: username,
        }),
    });

    const data = await response.json();
    console.log(data);
}
    */

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const user = await signup(email, password);
      router.push("/login");
    } catch (error) {
      alert("Signup error:", error.message);
    }
  };
  /*
    return (
        <main className="flex min-h-screen flex-col items-center h-full">
            <Title />
            <form
                className="bg-white h-64 w-64 rounded m-8 flex flex-col justify-center items-center"
                onSubmit={handleSignUp}
            >
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="m-2 bg-pink-100 rounded pl-1"
                    style={{ height: "10%", width: "80%" }}
                ></input>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="m-2 bg-pink-100 rounded pl-1"
                    style={{ height: "10%", width: "80%" }}
                ></input>

                <input
                    type="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="m-2 bg-pink-100 rounded pl-1"
                    style={{ height: "10%", width: "80%" }}
                ></input>

                <div className="flex flex-col justify-center items-center">
                    <button
                        type="submit"
                        className="bg-pink-100 w-16 m-4 rounded"
                    >
                        Sign Up
                    </button>

                    <a href="/" className="text-xs underline">
                        Have an Account? Log In
                    </a>
                </div>
            </form>
        </main>
    );
    */

  return (
    <div className="flex flex-row m-8 justify-center items-center bg-white w-1/2 h-4/6">
      <form className="m-8 flex flex-col justify-center items-center w-2/6 h-4/6 ">
        <h1 className="color-mypurple text-2xl font-bold">Sign up!</h1>
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
            className="bg-mypurple w-32 m-4 rounded p-2 text-white"
            onClick={handleSignUp}
          >
            SignUp
          </button>

          <a href="/login" className="text-lg underline">
            Already have an account? Login.
          </a>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
