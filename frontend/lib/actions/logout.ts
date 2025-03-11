// lib/logout.ts
"use client"; // Must be at the top for client-side code

import { useRouter } from "next/navigation";

export const logoutAccount =async () => {
    try {
        localStorage.removeItem("authToken"); // Remove token
        window.location.href = "/sign-in"; // Redirect to login page
    } catch (error) {
        console.error("Error during logout:", error);
		return null;
    }
};