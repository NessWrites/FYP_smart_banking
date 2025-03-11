'use client';
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/ui/MobileNav";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/api/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUser({ firstName: data.firstName, lastName: data.lastName });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={user || { firstName: "Guest", lastName: "" }} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={user || { firstName: "Guest", lastName: "" }} />
          </div>
        </div>

        {loading ? <p>Loading...</p> : children}
      </div>
    </main>
  );
}
