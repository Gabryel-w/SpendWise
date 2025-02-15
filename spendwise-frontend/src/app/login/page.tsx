"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Erro ao fazer login. Verifique suas credenciais.");
            }

            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user)); // Armazena usuário no localStorage

            alert("Login realizado com sucesso!");
            router.push("/dashboard"); // Redireciona para o Dashboard
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
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
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Entrar"}
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
