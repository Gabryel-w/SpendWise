"use client";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded mb-3 text-gray-900"
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded mb-3 text-gray-900"
                    />
                    <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                        Entrar
                    </button>
                </form>
                <p className="text-center text-sm mt-3 text-gray-900">
                    Ainda não tem uma conta?{" "}
                    <a href="/register" className="text-blue-500 underline">
                        Cadastre-se
                    </a>
                </p>
            </div>
        </div>
    );
}