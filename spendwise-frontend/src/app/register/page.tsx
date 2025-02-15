"use client";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

export default function RegisterPage() {
    const { register } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(email, password);
            alert("Cadastro realizado com sucesso!");
        } catch (error) {
            alert("Erro ao cadastrar usuário.");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">Cadastro</h1>
                <form onSubmit={handleRegister} className="flex flex-col">
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
                    <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
                        Cadastrar
                    </button>
                </form>
                <p className="text-center text-sm mt-3 text-gray-900">
                    Já tem uma conta?{" "}
                    <a href="/login" className="text-green-500 underline">
                        Faça login
                    </a>
                </p>
            </div>
        </div>
    );
}
