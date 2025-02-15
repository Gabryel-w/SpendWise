"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const [user, setUser] = useState<{ id: string; email: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        setUser(storedUser);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <header className="bg-gray-900 text-white py-4 px-6 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold">
                <Link href="/dashboard">SpendWise</Link>
            </h1>
            <nav>
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm">{user.email}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
                    >
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
}
