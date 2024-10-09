"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../Components/NavBar";
import useStore from "../store";

export default function WebappLayout({ children }) {
    const { zIsLoggedIn } = useStore();
    const router = useRouter();

    console.log(zIsLoggedIn);

    useEffect(() => {
         if (!zIsLoggedIn) {
             router.push("/login");
         }
    }, [zIsLoggedIn, router]);

    return (
        <>
            <NavBar />
            {children}
        </>
    );
}
