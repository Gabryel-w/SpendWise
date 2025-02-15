"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                throw new Error("Erro ao cadastrar usuário");
            }

            alert("Cadastro realizado com sucesso!");
            router.push("/login"); // Redireciona para login após sucesso
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-md w-96">
                    <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">Cadastro</h1>
                    <form onSubmit={handleRegister} className="flex flex-col">
                        <input
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border p-2 rounded mb-3 text-gray-900"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded mb-3 text-gray-900"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 rounded mb-3 text-gray-900"
                            required
                        />
                        <button
                            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Cadastrando..." : "Cadastrar"}
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
        </>
    );
}
