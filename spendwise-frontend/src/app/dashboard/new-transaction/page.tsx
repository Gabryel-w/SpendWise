"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";

export default function NewTransaction() {
    const router = useRouter();
    const [description, setDescription] = useState("");
    const [type, setType] = useState("income"); // "income" ou "expense"
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Obtém o usuário logado
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        console.log(user);

        if (!user?.id) {
            console.error("Usuário não autenticado");
            return;
        }

        const transactionData = {
            user_id: user.id,
            description,
            type,
            amount: parseFloat(amount),
            category,
            date
        };

        try {
            const response = await fetch("http://localhost:5000/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                throw new Error("Erro ao adicionar transação");
            }

            router.push("/dashboard"); // Redireciona para o Dashboard
        } catch (error) {
            console.error("Erro ao adicionar transação:", error);
        }
    };

    return (

        <>
            <Header />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
                <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-4">Nova Transação</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium">Descrição</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 border rounded mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Tipo</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-2 border rounded mt-1"
                                required
                            >
                                <option value="income">Receita</option>
                                <option value="expense">Despesa</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Valor (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full p-2 border rounded mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Categoria</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-2 border rounded mt-1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Data</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full p-2 border rounded mt-1"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                            Adicionar
                        </button>
                    </form>

                    <button
                        onClick={() => router.push("/dashboard")}
                        className="mt-4 w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition">
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        </>
    );
}
