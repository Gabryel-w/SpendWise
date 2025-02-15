"use client";

import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import supabase  from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Transaction = {
    id: number;
    description: string;
    amount: number;
    created_at: string;
};

export default function Dashboard() {
    const { logout } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const { data, error } = await supabase.from("transactions").select("*");
            if (!error) setTransactions(data || []);
        };
        fetchTransactions();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>

                <div className="flex justify-between mb-6">
                    <button 
                        onClick={() => router.push("/dashboard/new-transaction")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        + Nova Transação
                    </button>

                    <button 
                        onClick={logout} 
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                        Sair
                    </button>
                </div>

                <h2 className="text-xl font-bold">Minhas Transações</h2>
                <ul className="mt-4 space-y-3">
                    {transactions.length === 0 ? (
                        <p className="text-gray-500">Nenhuma transação encontrada.</p>
                    ) : (
                        transactions.map((transaction) => (
                            <li key={transaction.id} className="bg-gray-50 p-3 border rounded-md shadow-sm">
                                <p className="text-lg font-medium">{transaction.description}</p>
                                <p className="text-green-600 font-bold">R$ {transaction.amount.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
