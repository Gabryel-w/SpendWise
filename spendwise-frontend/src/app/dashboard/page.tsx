"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiEdit, FiTrash } from "react-icons/fi";
import Header from "@/components/header";

interface Transaction {
    id: string;
    description: string;
    type: "income" | "expense";
    amount: number;
    category: string;
    date: string;
}

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState(0);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [editForm, setEditForm] = useState({ description: "", type: "income", amount: 0, category: "", date: "" });
    const [searchTerm, setSearchTerm] = useState("");
  

    const router = useRouter();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                if (!user?.id) {
                    router.push("/login");
                    return;
                }

                const response = await fetch(`http://localhost:5000/transactions?user_id=${user.id}`);
                const data = await response.json();
                setTransactions(data);
                setFilteredTransactions(data);

                const total = data.reduce((acc: number, transaction: Transaction) => {
                    return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
                }, 0);
                setBalance(total);
            } catch (error) {
                console.error("Erro ao buscar transações", error);
            }
        };
        fetchTransactions();
    }, []);

     // Atualizar lista filtrada conforme o usuário digita na barra de pesquisa
     useEffect(() => {
        const filtered = transactions.filter((transaction) =>
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTransactions(filtered);
    }, [searchTerm, transactions]);

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setEditForm(transaction);
    };

    const handleUpdate = async () => {
        if (!editingTransaction) return;

        try {
            const response = await fetch(`http://localhost:5000/transactions/${editingTransaction.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (!response.ok) throw new Error("Erro ao atualizar transação");

            setTransactions((prevTransactions) => {
                const updatedTransactions = prevTransactions.map((t) =>
                    t.id === editingTransaction.id
                        ? { ...t, ...editForm, type: editForm.type as "income" | "expense" }
                        : t
                );
            
                // Recalcular saldo total
                const newBalance = updatedTransactions.reduce((acc, transaction) => {
                    return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
                }, 0);
            
                setBalance(newBalance);
                return updatedTransactions;
            });
            
            setEditingTransaction(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:5000/transactions/${id}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("Erro ao deletar transação.");
            }

            // Atualiza a lista removendo a transação deletada
            setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));

            // Recalcula o saldo
            setBalance((prev) => {
                const deletedTransaction = transactions.find((t) => t.id === id);
                if (!deletedTransaction) return prev;
                return deletedTransaction.type === "income"
                    ? prev - deletedTransaction.amount
                    : prev + deletedTransaction.amount;
            });

            console.log("Transação deletada com sucesso.");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Header />
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <Link href="/dashboard/new-transaction">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                            Adicionar Nova Transação
                        </button>
                    </Link>
                </div>

                <input
                    type="text"
                    placeholder="Pesquisar transações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                />

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div className="bg-white p-4 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold text-gray-700">Saldo Total</h2>
                        <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-500" : "text-red-500"}`}>
                            R$ {balance.toFixed(2)}
                        </p>
                    </motion.div>

                    <motion.div className="bg-white p-4 rounded-xl shadow-md col-span-2">
                        <h2 className="text-lg font-semibold text-gray-700">Últimas Transações</h2>
                        <ul className="mt-3 space-y-2">
                            {filteredTransactions.slice(0, 5).map((transaction) => (
                                <li key={transaction.id} className="flex justify-between border-b pb-2 text-gray-500">
                                    <span>{transaction.description}</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`font-bold ${
                                                transaction.type === "income" ? "text-green-600" : "text-red-600"
                                            }`}
                                        >
                                            {transaction.type === "income" ? "+" : "-"} R$ {transaction.amount.toFixed(2)}
                                        </span>

                                        <button
                                            className="text-red-500 hover:text-red-700 transition"
                                            onClick={() => handleDelete(transaction.id)}
                                        >
                                            <FiTrash size={18} />
                                        </button>

                                        <button onClick={() => handleEdit(transaction)} className="text-blue-500">
                                            <FiEdit />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {editingTransaction && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Editar Transação</h2>
                            <input
                                type="text"
                                placeholder="Descrição"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="border p-2 rounded mb-3 w-full"
                            />
                            <input
                                type="number"
                                placeholder="Valor"
                                value={editForm.amount}
                                onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
                                className="border p-2 rounded mb-3 w-full"
                            />
                            <select
                                value={editForm.type}
                                onChange={(e) => setEditForm({ ...editForm, type: e.target.value as "income" | "expense" })}
                                className="border p-2 rounded mb-3 w-full"
                            >
                                <option value="income">Receita</option>
                                <option value="expense">Despesa</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Categoria"
                                value={editForm.category}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                className="border p-2 rounded mb-3 w-full"
                            />
                            <input
                                type="date"
                                value={editForm.date}
                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                className="border p-2 rounded mb-3 w-full"
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingTransaction(null)} className="bg-gray-400 text-white px-4 py-2 rounded">
                                    Cancelar
                                </button>
                                <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    Atualizar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
