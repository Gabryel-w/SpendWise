"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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
    const [balance, setBalance] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user?.id) {
            console.log("Usuário não autenticado, redirecionando...");
            router.push("/login");
            return;
        }

        const fetchTransactions = async () => {
            try {
                const response = await fetch(`http://localhost:5000/transactions?user_id=${user.id}`);
                const data = await response.json();
                setTransactions(data);

                const total = data.reduce((acc: number, transaction: Transaction) => {
                    return transaction.type === "income" ? acc + transaction.amount : acc - transaction.amount;
                }, 0);
                setBalance(total);
            } catch (error) {
                console.error("Erro ao buscar transações", error);
            }
        };
        fetchTransactions();
    }, [router]);

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

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        className="bg-white p-4 rounded-xl shadow-md"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-lg font-semibold text-gray-700">Saldo Total</h2>
                        <motion.p
                            className={`text-2xl font-bold ${balance >= 0 ? "text-green-500" : "text-red-500"}`}
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.5 }}
                        >
                            R$ {balance.toFixed(2)}
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-4 rounded-xl shadow-md col-span-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-lg font-semibold text-gray-700">Últimas Transações</h2>
                        <ul className="mt-3 space-y-2">
                            {transactions.slice(0, 5).map((transaction) => (
                                <motion.li
                                    key={transaction.id}
                                    className="flex justify-between border-b pb-2 text-gray-500"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span>{transaction.description}</span>
                                    <span className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                        {transaction.type === "income" ? "+" : "-"} R$ {transaction.amount.toFixed(2)}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
